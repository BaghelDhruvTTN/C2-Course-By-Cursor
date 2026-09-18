package com.example.tickets.service;

import com.example.tickets.domain.Priority;
import com.example.tickets.domain.Ticket;
import com.example.tickets.domain.TicketStatus;
import com.example.tickets.dto.CreateTicketRequest;
import com.example.tickets.dto.UpdateTicketRequest;
import com.example.tickets.exception.InvalidStatusTransitionException;
import com.example.tickets.exception.TicketNotFoundException;
import com.example.tickets.repository.CommentRepository;
import com.example.tickets.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private TicketService ticketService;

    private Ticket ticket;

    @BeforeEach
    void setUp() {
        ticket = new Ticket();
        ticket.setId(1L);
        ticket.setTitle("Login issue");
        ticket.setDescription("Cannot log in");
        ticket.setPriority(Priority.HIGH);
        ticket.setStatus(TicketStatus.OPEN);
    }

    @Test
    void createTicket_alwaysSetsStatusOpen() {
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> {
            Ticket saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        var response = ticketService.createTicket(
                new CreateTicketRequest("Login issue", "Cannot log in", Priority.HIGH)
        );

        ArgumentCaptor<Ticket> captor = ArgumentCaptor.forClass(Ticket.class);
        verify(ticketRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(response.status()).isEqualTo(TicketStatus.OPEN);
    }

    @Test
    void updateTicket_doesNotChangeStatus() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);
        when(commentRepository.findByTicket_IdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        ticketService.updateTicket(1L, new UpdateTicketRequest(
                "Updated title", "Updated description", Priority.LOW, "agent@example.com"
        ));

        assertThat(ticket.getStatus()).isEqualTo(TicketStatus.OPEN);
        assertThat(ticket.getTitle()).isEqualTo("Updated title");
    }

    @Test
    void transitionStatus_sameStatus_isNoOp() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(commentRepository.findByTicket_IdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var response = ticketService.transitionStatus(1L, TicketStatus.OPEN);

        verify(ticketRepository, never()).save(any());
        assertThat(response.status()).isEqualTo(TicketStatus.OPEN);
    }

    @ParameterizedTest(name = "{0} -> {1} succeeds")
    @CsvSource({
            "OPEN, IN_PROGRESS",
            "OPEN, CANCELLED",
            "IN_PROGRESS, RESOLVED",
            "IN_PROGRESS, CANCELLED",
            "RESOLVED, CLOSED"
    })
    void transitionStatus_validTransitions(TicketStatus from, TicketStatus to) {
        ticket.setStatus(from);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);
        when(commentRepository.findByTicket_IdOrderByCreatedAtAsc(1L)).thenReturn(List.of());

        var response = ticketService.transitionStatus(1L, to);

        assertThat(response.status()).isEqualTo(to);
    }

    @ParameterizedTest(name = "{0} -> {1} is rejected")
    @CsvSource({
            "CLOSED, OPEN",
            "RESOLVED, OPEN",
            "CANCELLED, OPEN",
            "OPEN, CLOSED",
            "OPEN, RESOLVED",
            "RESOLVED, IN_PROGRESS",
            "CLOSED, IN_PROGRESS",
            "IN_PROGRESS, OPEN"
    })
    void transitionStatus_invalidTransitions(TicketStatus from, TicketStatus to) {
        ticket.setStatus(from);
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        assertThatThrownBy(() -> ticketService.transitionStatus(1L, to))
                .isInstanceOf(InvalidStatusTransitionException.class)
                .hasMessage("Cannot transition from " + from + " to " + to);
    }

    @Test
    void getTicketById_notFound_throwsTicketNotFoundException() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> ticketService.getTicketById(99L))
                .isInstanceOf(TicketNotFoundException.class);
    }
}
