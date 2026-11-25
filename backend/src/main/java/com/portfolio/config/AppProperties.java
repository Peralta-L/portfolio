package com.portfolio.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Typed application settings bound from the {@code app.*} namespace.
 *
 * @param cors      origins allowed to call the API from a browser
 * @param rateLimit limits for the public contact endpoint
 */
@Validated
@ConfigurationProperties(prefix = "app")
public record AppProperties(@Valid @NotNull Cors cors, @Valid @NotNull RateLimit rateLimit) {

    public record Cors(@NotEmpty List<String> allowedOrigins) {
    }

    /**
     * @param maxRequests       requests allowed per client within {@code window}
     * @param globalMaxRequests requests allowed from all clients together within {@code window}
     * @param window            length of the sliding window
     */
    public record RateLimit(@Min(1) int maxRequests, @Min(1) int globalMaxRequests, @NotNull Duration window) {
    }
}
