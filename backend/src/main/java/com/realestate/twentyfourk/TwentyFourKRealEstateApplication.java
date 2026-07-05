package com.realestate.twentyfourk;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.net.URI;
import java.net.URISyntaxException;

@SpringBootApplication
public class TwentyFourKRealEstateApplication {

    private static final Logger log = LoggerFactory.getLogger(TwentyFourKRealEstateApplication.class);

    public static void main(String[] args) {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            try {
                if (databaseUrl.startsWith("postgres://")) {
                    databaseUrl = databaseUrl.replace("postgres://", "postgresql://");
                }
                URI uri = new URI(databaseUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String username = userInfo.split(":")[0];
                    String password = userInfo.split(":")[1];
                    String host = uri.getHost();
                    int port = uri.getPort();
                    String path = uri.getPath();
                    
                    String jdbcUrl = "jdbc:postgresql://" + host + ":" + (port == -1 ? 5432 : port) + path;
                    
                    System.setProperty("spring.datasource.url", jdbcUrl);
                    System.setProperty("spring.datasource.username", username);
                    System.setProperty("spring.datasource.password", password);
                    System.setProperty("spring.jpa.database-platform", "org.hibernate.dialect.PostgreSQLDialect");
                    System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
                    
                    log.info("[DATABASE CLOUD INJECTOR] Successfully set Spring Boot connection properties from DATABASE_URL.");
                }
            } catch (URISyntaxException | NullPointerException | IndexOutOfBoundsException e) {
                log.error("[DATABASE CLOUD INJECTOR] Failed to parse DATABASE_URL: {}", e.getMessage());
            }
        }
        SpringApplication.run(TwentyFourKRealEstateApplication.class, args);
    }
}
