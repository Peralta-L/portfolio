package com.portfolio;

import io.zonky.test.db.postgres.embedded.EmbeddedPostgres;
import java.io.IOException;
import javax.sql.DataSource;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/** Starts a throwaway PostgreSQL server for the test context. */
@TestConfiguration(proxyBeanMethods = false)
public class EmbeddedPostgresConfig {

    @Bean(destroyMethod = "close")
    EmbeddedPostgres embeddedPostgres() throws IOException {
        return EmbeddedPostgres.start();
    }

    @Bean
    @Primary
    DataSource dataSource(EmbeddedPostgres postgres) {
        return postgres.getPostgresDatabase();
    }
}
