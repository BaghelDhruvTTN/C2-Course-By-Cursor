package com.example.tickets.util;

import com.example.tickets.exception.InvalidQueryParameterException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;
import java.util.stream.Collectors;

public final class TicketListQuerySupport {

    private static final String DEFAULT_SORT = "createdAt,desc";
    private static final Set<String> ALLOWED_SORT_PROPERTIES = Set.of(
            "createdAt", "updatedAt", "title", "priority", "status", "id"
    );
    private static final int MAX_PAGE_SIZE = 100;

    private TicketListQuerySupport() {
    }

    public static Pageable toPageable(int page, int size, String sort) {
        if (page < 0) {
            throw new InvalidQueryParameterException("page must be >= 0");
        }
        if (size < 1) {
            throw new InvalidQueryParameterException("size must be >= 1");
        }
        if (size > MAX_PAGE_SIZE) {
            throw new InvalidQueryParameterException("size must be <= " + MAX_PAGE_SIZE);
        }

        return PageRequest.of(page, size, parseSort(sort));
    }

    private static Sort parseSort(String sort) {
        String sortParam = (sort == null || sort.isBlank()) ? DEFAULT_SORT : sort.trim();
        String[] parts = sortParam.split(",", 2);

        if (parts.length != 2 || parts[0].isBlank() || parts[1].isBlank()) {
            throw new InvalidQueryParameterException(
                    "sort must be in the form property,direction (e.g. createdAt,desc)"
            );
        }

        String property = parts[0].trim();
        String direction = parts[1].trim().toLowerCase();

        if (!ALLOWED_SORT_PROPERTIES.contains(property)) {
            String allowed = ALLOWED_SORT_PROPERTIES.stream()
                    .sorted()
                    .collect(Collectors.joining(", "));
            throw new InvalidQueryParameterException(
                    "Invalid sort property '" + property + "'. Allowed: " + allowed
            );
        }

        Sort.Direction sortDirection;
        if ("asc".equals(direction)) {
            sortDirection = Sort.Direction.ASC;
        } else if ("desc".equals(direction)) {
            sortDirection = Sort.Direction.DESC;
        } else {
            throw new InvalidQueryParameterException("sort direction must be 'asc' or 'desc'");
        }

        return Sort.by(sortDirection, property);
    }
}
