package com.example.tickets.integration;

import com.example.tickets.config.JpaAuditingConfig;
import com.example.tickets.repository.CommentRepository;
import com.example.tickets.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@AutoConfigureMockMvc
@Import(JpaAuditingConfig.class)
@ActiveProfiles("test")
public abstract class IntegrationTestBase {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;

    @BeforeEach
    void cleanDatabase() {
        commentRepository.deleteAll();
        ticketRepository.deleteAll();
    }
}
