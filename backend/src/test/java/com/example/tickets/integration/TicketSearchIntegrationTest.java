package com.example.tickets.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TicketSearchIntegrationTest extends IntegrationTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void searchByKeyword_matchesTitleAndDescription() throws Exception {
        TicketApiTestSupport.createTicket(mockMvc, objectMapper, "Password reset broken", "Email not received");
        TicketApiTestSupport.createTicket(mockMvc, objectMapper, "Billing issue", "Invoice mismatch");

        mockMvc.perform(get("/api/tickets").param("keyword", "password"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Password reset broken")));

        mockMvc.perform(get("/api/tickets").param("keyword", "invoice"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Billing issue")));
    }

    @Test
    void filterByStatus_returnsMatchingTicketsOnly() throws Exception {
        TicketApiTestSupport.createTicket(mockMvc, objectMapper, "Alpha open ticket", "Still open");
        long closedTicketId = TicketApiTestSupport.createTicket(mockMvc, objectMapper, "Alpha closed ticket", "Will close");

        TicketApiTestSupport.transitionTo(mockMvc, closedTicketId, com.example.tickets.domain.TicketStatus.IN_PROGRESS);
        TicketApiTestSupport.transitionTo(mockMvc, closedTicketId, com.example.tickets.domain.TicketStatus.RESOLVED);
        TicketApiTestSupport.transitionTo(mockMvc, closedTicketId, com.example.tickets.domain.TicketStatus.CLOSED);

        mockMvc.perform(get("/api/tickets").param("status", "OPEN").param("keyword", "Alpha open"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].status", is("OPEN")));

        mockMvc.perform(get("/api/tickets").param("status", "CLOSED").param("keyword", "Alpha closed"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].status", is("CLOSED")));
    }
}
