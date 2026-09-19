package com.example.tickets.service;

import com.example.tickets.domain.Comment;
import com.example.tickets.domain.Ticket;
import com.example.tickets.domain.TicketStatus;
import com.example.tickets.dto.CommentResponse;
import com.example.tickets.dto.CreateCommentRequest;
import com.example.tickets.dto.CreateTicketRequest;
import com.example.tickets.dto.PagedTicketResponse;
import com.example.tickets.dto.TicketResponse;
import com.example.tickets.dto.TicketSummary;
import com.example.tickets.dto.UpdateTicketRequest;
import com.example.tickets.exception.InvalidStatusTransitionException;
import com.example.tickets.exception.TicketNotFoundException;
import com.example.tickets.repository.CommentRepository;
import com.example.tickets.repository.TicketRepository;
import com.example.tickets.util.TicketListQuerySupport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;

    public TicketService(TicketRepository ticketRepository, CommentRepository commentRepository) {
        this.ticketRepository = ticketRepository;
        this.commentRepository = commentRepository;
    }

    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority());
        ticket.setStatus(TicketStatus.OPEN);

        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved, List.of());
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = findTicketOrThrow(id);
        return toResponse(ticket, loadComments(id));
    }

    public PagedTicketResponse listTickets(
            String keyword,
            TicketStatus status,
            int page,
            int size,
            String sort
    ) {
        String validatedKeyword = TicketListQuerySupport.validateKeyword(keyword);
        Pageable pageable = TicketListQuerySupport.toPageable(page, size, sort);
        Page<Ticket> results = ticketRepository.searchTickets(validatedKeyword, status, pageable);

        List<TicketSummary> content = results.getContent().stream()
                .map(this::toSummary)
                .toList();

        return new PagedTicketResponse(
                content,
                results.getNumber(),
                results.getSize(),
                results.getTotalElements(),
                results.getTotalPages()
        );
    }

    @Transactional
    public TicketResponse updateTicket(Long id, UpdateTicketRequest request) {
        Ticket ticket = findTicketOrThrow(id);
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority());
        ticket.setAssignee(request.assignee());

        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved, loadComments(id));
    }

    @Transactional
    public TicketResponse transitionStatus(Long id, TicketStatus newStatus) {
        Ticket ticket = findTicketOrThrow(id);
        TicketStatus currentStatus = ticket.getStatus();

        if (currentStatus == newStatus) {
            return toResponse(ticket, loadComments(id));
        }

        if (!TicketStatusTransitions.isAllowed(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException(currentStatus, newStatus);
        }

        ticket.setStatus(newStatus);
        Ticket saved = ticketRepository.save(ticket);
        return toResponse(saved, loadComments(id));
    }

    @Transactional
    public CommentResponse addComment(Long ticketId, CreateCommentRequest request) {
        Ticket ticket = findTicketOrThrow(ticketId);

        Comment comment = new Comment();
        comment.setBody(request.body());
        comment.setAuthor(request.author());
        ticket.addComment(comment);

        Comment saved = commentRepository.saveAndFlush(comment);
        return toCommentResponse(saved);
    }

    private Ticket findTicketOrThrow(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    private List<CommentResponse> loadComments(Long ticketId) {
        return commentRepository.findByTicket_IdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::toCommentResponse)
                .toList();
    }

    private TicketSummary toSummary(Ticket ticket) {
        return new TicketSummary(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getAssignee(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt()
        );
    }

    private TicketResponse toResponse(Ticket ticket, List<CommentResponse> comments) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getAssignee(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                comments
        );
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getBody(),
                comment.getAuthor(),
                comment.getCreatedAt()
        );
    }
}
