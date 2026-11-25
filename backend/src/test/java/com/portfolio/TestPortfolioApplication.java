package com.portfolio;

import org.springframework.boot.SpringApplication;

/**
 * Runs the API locally on a throwaway embedded PostgreSQL, so no database install
 * is needed for development: {@code ./mvnw spring-boot:test-run}.
 */
public class TestPortfolioApplication {

    public static void main(String[] args) {
        SpringApplication.from(PortfolioApplication::main)
                .with(EmbeddedPostgresConfig.class)
                .run(args);
    }
}
