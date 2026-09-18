package com.example.tickets.integration;

import com.example.tickets.domain.Priority;
import com.example.tickets.domain.Ticket;
import com.example.tickets.domain.TicketStatus;
import com.example.tickets.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;

class TicketPersistenceIntegrationTest {

    private static final Path PERSISTENCE_DIR = Path.of("target", "persistence-test");

    @Test
    void ticketDataSurvivesApplicationRestart() {
        deletePersistenceFiles();

        Long ticketId;
        try (var context = new SpringApplicationBuilder(
                com.example.tickets.TicketsApplication.class)
                .web(WebApplicationType.NONE)
                .profiles("persistence-test")
                .properties("spring.profiles.active=persistence-test")
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
                .properties("spring.profiles.active=persistence-test")
                .run()) {
            TicketRepository repository = context.getBean(TicketRepository.class);

            Ticket loaded = repository.findById(ticketId).orElseThrow();
            assertThat(loaded.getTitle()).isEqualTo("Persistence ticket");
            assertThat(loaded.getStatus()).isEqualTo(TicketStatus.OPEN);
        }
    }

    private static void deletePersistenceFiles() {
        try {
            if (Files.exists(PERSISTENCE_DIR)) {
                Files.walk(PERSISTENCE_DIR)
                        .sorted((a, b) -> b.compareTo(a))
                        .forEach(path -> {
                            try {
                                Files.deleteIfExists(path);
                            } catch (IOException ignored) {
                                // Best-effort cleanup before test
                            }
                        });
            }
        } catch (IOException ignored) {
            // Best-effort cleanup before test
        }
    }
}
