package com.example.tickets.dto;

import com.example.tickets.domain.Priority;
import com.example.tickets.domain.TicketStatus;

import java.time.Instant;

public record TicketSummary(
        Long id,
        String title,
        Priority priority,
        TicketStatus status,
        String assignee,
        Instant createdAt,
        Instant updatedAt
) {
}
