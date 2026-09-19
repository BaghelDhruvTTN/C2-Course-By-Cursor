package com.example.tickets.config;

import com.example.tickets.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.Instant;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableConfigurationProperties({SecurityProperties.class, RateLimitProperties.class})
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityProperties securityProperties,
            ObjectMapper objectMapper
    ) throws Exception {
        http.csrf(csrf -> csrf.disable());

        if (!securityProperties.isEnabled()) {
            return http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll()).build();
        }

        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/api/health").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .addFilterBefore(
                        new ApiKeyAuthFilter(securityProperties),
                        UsernamePasswordAuthenticationFilter.class
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    ErrorResponse body = new ErrorResponse(
                            Instant.now(),
                            HttpStatus.UNAUTHORIZED.value(),
                            "Unauthorized",
                            "Missing or invalid API key",
                            request.getRequestURI(),
                            List.of()
                    );
                    objectMapper.writeValue(response.getOutputStream(), body);
                }));

        return http.build();
    }
}
