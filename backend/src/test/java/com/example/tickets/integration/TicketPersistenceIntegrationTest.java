package com.example.tickets.integration;

import com.example.tickets.domain.Priority;
import com.example.tickets.domain.Ticket;
import com.example.tickets.domain.TicketStatus;
import com.example.tickets.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class TicketPersistenceIntegrationTest {

    @Test
    void ticketDataSurvivesApplicationRestart() {
        String databaseUrl = "jdbc:h2:file:./target/persistence-test/db-"
                + UUID.randomUUID().toString().replace("-", "")
                + "/tickets;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE";

        Long ticketId;
        try (var context = new SpringApplicationBuilder(
                com.example.tickets.TicketsApplication.class)
                .web(WebApplicationType.NONE)
                .profiles("persistence-test")
                .properties(
                        "spring.profiles.active=persistence-test",
                        "spring.datasource.url=" + databaseUrl
                )
                .run()) {
            TicketRepository repository = context.getBean(TicketRepository.class);

            Ticket ticket = new Ticket();
            ticket.setTitle("Persistence ticket");
            ticket.setDescription("Should survive restart");
            ticket.setPriority(Priority.MEDIUM);
            ticket.setStatus(TicketStatus.OPEN);

            ticketId = repository.save(ticket).getId();
        }

        try (var context = new SpringApplicationBuilder(
                com.example.tickets.TicketsApplication.class)
                .web(WebApplicationType.NONE)
                .profiles("persistence-test")
                .properties(
                        "spring.profiles.active=persistence-test",
                        "spring.datasource.url=" + databaseUrl
                )
                .run()) {
            TicketRepository repository = context.getBean(TicketRepository.class);

            Ticket loaded = repository.findById(ticketId).orElseThrow();
            assertThat(loaded.getTitle()).isEqualTo("Persistence ticket");
            assertThat(loaded.getStatus()).isEqualTo(TicketStatus.OPEN);
        }
    }
}
