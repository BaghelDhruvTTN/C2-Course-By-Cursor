package com.example.tickets.integration;

import com.example.tickets.domain.TicketStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TicketStateMachineIntegrationTest extends IntegrationTestBase {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @ParameterizedTest(name = "{0} -> {1} is allowed")
    @CsvSource({
            "OPEN, IN_PROGRESS",
            "OPEN, CANCELLED",
            "IN_PROGRESS, RESOLVED",
            "IN_PROGRESS, CANCELLED",
            "RESOLVED, CLOSED"
    })
    void validTransitions_returnOk(TicketStatus from, TicketStatus to) throws Exception {
        long ticketId = TicketApiTestSupport.createTicketInStatus(mockMvc, objectMapper, from);

        mockMvc.perform(patch("/api/tickets/{id}/status", ticketId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("{\"status\": \"%s\"}", to.name())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is(to.name())));
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
    void invalidTransitions_returnBadRequest(TicketStatus from, TicketStatus to) throws Exception {
        long ticketId = TicketApiTestSupport.createTicketInStatus(mockMvc, objectMapper, from);

        mockMvc.perform(patch("/api/tickets/{id}/status", ticketId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(String.format("{\"status\": \"%s\"}", to.name())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", is("Cannot transition from " + from + " to " + to)));
    }
}
