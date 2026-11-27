package com.portfolio;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.portfolio.repository.ContactMessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Full stack against real PostgreSQL: Flyway migrations, Hibernate schema validation,
 * security rules, CORS, validation and rate limiting.
 */
@SpringBootTest(properties = {
        "app.cors.allowed-origins=https://portfolio.example",
        "app.rate-limit.max-requests=3",
        "app.rate-limit.window=PT1H"
})
@AutoConfigureMockMvc
@Import(EmbeddedPostgresConfig.class)
class PortfolioApiIntegrationTest {

    private static final String VALID_MESSAGE = """
            {"name":"Ada Lovelace","email":"Ada@Example.com","subject":"Backend role",
             "message":"Hi Luis, I would like to talk about a backend position."}
            """;

    /** Each request helper call gets its own client IP so rate limits never leak between tests. */
    private static final AtomicInteger CLIENTS = new AtomicInteger();

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ContactMessageRepository contactMessages;

    @BeforeEach
    void clearMessages() {
        contactMessages.deleteAll();
    }

    private static MockHttpServletRequestBuilder contact(String body, String clientIp) {
        return post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body)
                .with(request -> {
                    request.setRemoteAddr(clientIp);
                    return request;
                });
    }

    private static String newClient() {
        return "10.0.0." + CLIENTS.incrementAndGet();
    }

    @Test
    void listsSeededProjectsInDisplayOrder() throws Exception {
        mvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "max-age=600, public"))
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].slug", is("what-to-eat")))
                .andExpect(jsonPath("$[0].technologies[0]", is("Python")))
                .andExpect(jsonPath("$[3].githubUrl", is("https://github.com/Peralta-L/portfolio")));
    }

    @Test
    void groupsSkillsByCategory() throws Exception {
        mvc.perform(get("/api/skills"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].category", is("BACKEND")))
                .andExpect(jsonPath("$[0].label", is("Backend")))
                .andExpect(jsonPath("$[0].skills", hasSize(12)))
                .andExpect(jsonPath("$[2].label", is("Cloud & DevOps")));
    }

    @Test
    void listsExperienceMostRecentFirst() throws Exception {
        mvc.perform(get("/api/experience"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].organization", is("Oppenhoff & Partner")))
                .andExpect(jsonPath("$[0].current", is(true)))
                .andExpect(jsonPath("$[0].highlights", hasSize(3)))
                .andExpect(jsonPath("$[1].organization", is("U.S. Army")))
                .andExpect(jsonPath("$[1].current", is(false)));
    }

    @Test
    void persistsValidContactMessage() throws Exception {
        mvc.perform(contact(VALID_MESSAGE, newClient()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("received")));

        assertThat(contactMessages.findAll()).singleElement().satisfies(m -> {
            assertThat(m.getEmail()).isEqualTo("ada@example.com");
            assertThat(m.getCreatedAt()).isNotNull();
        });
    }

    @Test
    void rejectsInvalidContactMessageWithFieldErrors() throws Exception {
        mvc.perform(contact("""
                        {"name":"","email":"not-an-email","subject":"Hi","message":"short"}
                        """, newClient()))
                .andExpect(status().isBadRequest())
                .andExpect(header().string("Content-Type", "application/problem+json"))
                .andExpect(jsonPath("$.title", is("Validation failed")))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.message").exists());

        assertThat(contactMessages.count()).isZero();
    }

    @Test
    void silentlyDropsHoneypotSubmissions() throws Exception {
        String spam = VALID_MESSAGE.replace("\"name\"", "\"website\":\"http://spam.example\",\"name\"");

        mvc.perform(contact(spam, newClient()))
                .andExpect(status().isCreated());

        assertThat(contactMessages.count()).isZero();
    }

    @Test
    void rateLimitsContactSubmissionsPerClient() throws Exception {
        String client = newClient();
        for (int i = 0; i < 3; i++) {
            mvc.perform(contact(VALID_MESSAGE, client))
                    .andExpect(status().isCreated());
        }
        mvc.perform(contact(VALID_MESSAGE, client))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"))
                .andExpect(jsonPath("$.status", is(429)));

        assertThat(contactMessages.count()).isEqualTo(3);
    }

    @Test
    void allowsCorsPreflightOnlyFromConfiguredOrigin() throws Exception {
        mvc.perform(options("/api/contact")
                        .header("Origin", "https://portfolio.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://portfolio.example"));

        mvc.perform(options("/api/contact")
                        .header("Origin", "https://evil.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }

    @Test
    void deniesEverythingNotOnTheAllowList() throws Exception {
        mvc.perform(get("/api/contact")).andExpect(status().isNotFound());
        mvc.perform(get("/actuator/env")).andExpect(status().isNotFound());
        mvc.perform(get("/actuator/health")).andExpect(status().isOk());
    }
}
