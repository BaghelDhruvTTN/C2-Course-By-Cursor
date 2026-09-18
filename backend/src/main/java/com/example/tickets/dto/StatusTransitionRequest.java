package com.example.tickets.dto;

import com.example.tickets.domain.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record StatusTransitionRequest(
        @NotNull TicketStatus status
) {
}
