package com.example.tickets.dto;

import java.util.List;

public record PagedTicketResponse(
        List<TicketSummary> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
