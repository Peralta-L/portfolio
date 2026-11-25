package com.portfolio.security;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

class ContactRateLimitFilterTest {

    private final Clock clock = Clock.fixed(Instant.parse("2026-01-01T00:00:00Z"), ZoneOffset.UTC);
    private final ContactRateLimitFilter filter = new ContactRateLimitFilter(
            new SlidingWindowRateLimiter(5, Duration.ofHours(1), clock),
            new SlidingWindowRateLimiter(3, Duration.ofHours(1), clock),
            new ObjectMapper());

    /** A bot that changes its (spoofed) address on every request still hits the global cap. */
    @Test
    void globalCapBlocksClientsThatKeepChangingAddress() throws Exception {
        for (int i = 1; i <= 3; i++) {
            assertThat(post("203.0.113." + i).getStatus()).isEqualTo(200);
        }

        MockHttpServletResponse blocked = post("203.0.113.99");
        assertThat(blocked.getStatus()).isEqualTo(429);
        assertThat(blocked.getHeader("Retry-After")).isEqualTo("3600");
    }

    private MockHttpServletResponse post(String clientIp) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("POST", ContactRateLimitFilter.CONTACT_PATH);
        request.setRemoteAddr(clientIp);
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, new MockFilterChain());
        return response;
    }
}
