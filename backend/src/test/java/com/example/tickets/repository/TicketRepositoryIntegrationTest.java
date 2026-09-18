package com.example.tickets.repository;

import com.example.tickets.config.JpaAuditingConfig;
import com.example.tickets.domain.Comment;
import com.example.tickets.domain.Priority;
import com.example.tickets.domain.Ticket;
import com.example.tickets.domain.TicketStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(JpaAuditingConfig.class)
@ActiveProfiles("test")
class TicketRepositoryIntegrationTest {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Test
    void savesTicketWithDefaultOpenStatusAndAuditingTimestamps() {
        Ticket ticket = new Ticket();
        ticket.setTitle("Login issue");
        ticket.setDescription("Users cannot log in");
        ticket.setPriority(Priority.HIGH);

        Ticket saved = ticketRepository.save(ticket);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getUpdatedAt()).isNotNull();
    }

    @Test
    void searchTickets_filtersByKeywordAndStatus() {
        Ticket openTicket = ticket("Password reset broken", "Reset email not sent", Priority.MEDIUM);
        Ticket closedTicket = ticket("Login issue", "Invalid credentials error", Priority.HIGH);
        closedTicket.setStatus(TicketStatus.CLOSED);
        ticketRepository.saveAll(List.of(openTicket, closedTicket));

        var keywordResults = ticketRepository.searchTickets("password", null, PageRequest.of(0, 10));
        var statusResults = ticketRepository.searchTickets(null, TicketStatus.CLOSED, PageRequest.of(0, 10));

        assertThat(keywordResults.getContent()).hasSize(1);
        assertThat(keywordResults.getContent().get(0).getTitle()).contains("Password");
        assertThat(statusResults.getContent()).hasSize(1);
        assertThat(statusResults.getContent().get(0).getStatus()).isEqualTo(TicketStatus.CLOSED);
    }

    @Test
    void savesCommentLinkedToTicket() {
        Ticket ticket = ticketRepository.save(ticket("Billing question", "Invoice mismatch", Priority.LOW));

        Comment comment = new Comment();
        comment.setBody("Reviewed account history");
        comment.setAuthor("alice@example.com");
        ticket.addComment(comment);
        ticketRepository.save(ticket);

        assertThat(commentRepository.findByTicket_IdOrderByCreatedAtAsc(ticket.getId())).hasSize(1);
    }

    private static Ticket ticket(String title, String description, Priority priority) {
        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setPriority(priority);
        return ticket;
    }
}
