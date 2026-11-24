package com.portfolio.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Throttles {@code POST /api/contact} per client IP and answers with an RFC 9457
 * problem response (429) when the limit is exceeded.
 *
 * <p>The client IP comes from {@link HttpServletRequest#getRemoteAddr()}, which
 * reflects {@code X-Forwarded-For} because {@code server.forward-headers-strategy}
 * is set to {@code framework} for deployments behind a proxy (Render).
 */
public class ContactRateLimitFilter extends OncePerRequestFilter {

    static final String CONTACT_PATH = "/api/contact";

    private final SlidingWindowRateLimiter rateLimiter;
    private final ObjectMapper objectMapper;

    public ContactRateLimitFilter(SlidingWindowRateLimiter rateLimiter, ObjectMapper objectMapper) {
        this.rateLimiter = rateLimiter;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !(HttpMethod.POST.matches(request.getMethod()) && CONTACT_PATH.equals(request.getRequestURI()));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String client = request.getRemoteAddr();
        if (rateLimiter.tryAcquire(client)) {
            chain.doFilter(request, response);
            return;
        }

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.TOO_MANY_REQUESTS, "Too many messages. Please try again later.");
        problem.setTitle("Too Many Requests");
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader(HttpHeaders.RETRY_AFTER, String.valueOf(rateLimiter.retryAfterSeconds(client)));
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), problem);
    }
}
