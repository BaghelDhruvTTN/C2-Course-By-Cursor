package com.example.tickets.dto;

import com.example.tickets.domain.Priority;
import com.example.tickets.domain.TicketStatus;

import java.time.Instant;
import java.util.List;

public record TicketResponse(
        Long id,
        String title,
        String description,
        Priority priority,
        TicketStatus status,
        String assignee,
        Instant createdAt,
        Instant updatedAt,
        List<CommentResponse> comments
) {
}
