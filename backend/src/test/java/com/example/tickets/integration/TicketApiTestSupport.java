package com.example.tickets.integration;

import com.example.tickets.domain.TicketStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

final class TicketApiTestSupport {

    private TicketApiTestSupport() {
    }

    static long createTicket(MockMvc mockMvc, ObjectMapper objectMapper, String title, String description)
            throws Exception {
        MvcResult result = mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("""
                                {
                                  "title": "%s",
                                  "description": "%s",
                                  "priority": "HIGH"
                                }
                                """, title, description)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return body.get("id").asLong();
    }

    static void transitionTo(MockMvc mockMvc, long ticketId, TicketStatus status) throws Exception {
        mockMvc.perform(patch("/api/tickets/{id}/status", ticketId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("{\"status\": \"%s\"}", status.name())))
                .andExpect(status().isOk());
    }

    static long createTicketInStatus(MockMvc mockMvc, ObjectMapper objectMapper, TicketStatus status)
            throws Exception {
        long ticketId = createTicket(mockMvc, objectMapper, "Ticket for " + status, "Setup ticket");

        if (status == TicketStatus.OPEN) {
            return ticketId;
        }
        if (status == TicketStatus.IN_PROGRESS || status == TicketStatus.CANCELLED) {
            transitionTo(mockMvc, ticketId, status);
            return ticketId;
        }
        if (status == TicketStatus.RESOLVED) {
            transitionTo(mockMvc, ticketId, TicketStatus.IN_PROGRESS);
            transitionTo(mockMvc, ticketId, TicketStatus.RESOLVED);
            return ticketId;
        }
        if (status == TicketStatus.CLOSED) {
            transitionTo(mockMvc, ticketId, TicketStatus.IN_PROGRESS);
            transitionTo(mockMvc, ticketId, TicketStatus.RESOLVED);
            transitionTo(mockMvc, ticketId, TicketStatus.CLOSED);
            return ticketId;
        }

        throw new IllegalArgumentException("Unsupported status: " + status);
    }
}
