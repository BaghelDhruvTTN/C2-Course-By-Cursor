package com.example.tickets.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class OpenApiConfig {

    @Bean
    public OpenAPI ticketOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Support Ticket Management API")
                        .description("REST API for managing support tickets")
                        .version("1.0.0"));
    }
}
