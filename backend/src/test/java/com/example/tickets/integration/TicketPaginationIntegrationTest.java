package com.example.tickets.integration;

import com.example.tickets.config.JpaAuditingConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(JpaAuditingConfig.class)
@ActiveProfiles("test")
class TicketPaginationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void negativePage_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/tickets").param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", is("page must be >= 0")));
    }

    @Test
    void zeroSize_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/tickets").param("size", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message", is("size must be >= 1")));
    }

    @Test
    void invalidSort_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/tickets").param("sort", "assignee,asc"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Invalid sort property")));
    }

    @Test
    void sortByTitleAsc_ordersResults() throws Exception {
        TicketApiTestSupport.createTicket(mockMvc, objectMapper, "Zebra issue", "Last alphabetically");
        TicketApiTestSupport.createTicket(mockMvc, objectMapper, "Alpha issue", "First alphabetically");

        mockMvc.perform(get("/api/tickets")
                        .param("keyword", "alphabetically")
                        .param("sort", "title,asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[0].title", is("Alpha issue")))
                .andExpect(jsonPath("$.content[1].title", is("Zebra issue")));
    }
}
