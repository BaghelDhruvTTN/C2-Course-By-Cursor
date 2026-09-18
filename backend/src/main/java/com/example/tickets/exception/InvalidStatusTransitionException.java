package com.example.tickets.exception;

import com.example.tickets.domain.TicketStatus;

public class InvalidStatusTransitionException extends RuntimeException {

    private final TicketStatus currentStatus;
    private final TicketStatus requestedStatus;

    public InvalidStatusTransitionException(TicketStatus currentStatus, TicketStatus requestedStatus) {
        super("Cannot transition from " + currentStatus + " to " + requestedStatus);
        this.currentStatus = currentStatus;
        this.requestedStatus = requestedStatus;
    }

    public TicketStatus getCurrentStatus() {
        return currentStatus;
    }

    public TicketStatus getRequestedStatus() {
        return requestedStatus;
    }
}
