package com.example.tickets.util;

import com.example.tickets.exception.InvalidQueryParameterException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TicketListQuerySupportTest {

    @Test
    void toPageable_defaultsSortToCreatedAtDesc() {
        Pageable pageable = TicketListQuerySupport.toPageable(0, 20, null);

        assertThat(pageable.getPageNumber()).isZero();
        assertThat(pageable.getPageSize()).isEqualTo(20);
        assertThat(pageable.getSort()).isEqualTo(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    @Test
    void toPageable_parsesCustomSort() {
        Pageable pageable = TicketListQuerySupport.toPageable(1, 10, "title,asc");

        assertThat(pageable.getPageNumber()).isEqualTo(1);
        assertThat(pageable.getPageSize()).isEqualTo(10);
        assertThat(pageable.getSort()).isEqualTo(Sort.by(Sort.Direction.ASC, "title"));
    }

    @ParameterizedTest
    @ValueSource(ints = {-1, -10})
    void toPageable_rejectsNegativePage(int page) {
        assertThatThrownBy(() -> TicketListQuerySupport.toPageable(page, 20, null))
                .isInstanceOf(InvalidQueryParameterException.class)
                .hasMessage("page must be >= 0");
    }

    @ParameterizedTest
    @ValueSource(ints = {0, -1})
    void toPageable_rejectsInvalidSize(int size) {
        assertThatThrownBy(() -> TicketListQuerySupport.toPageable(0, size, null))
                .isInstanceOf(InvalidQueryParameterException.class)
                .hasMessage("size must be >= 1");
    }

    @Test
    void toPageable_rejectsExcessiveSize() {
        assertThatThrownBy(() -> TicketListQuerySupport.toPageable(0, 101, null))
                .isInstanceOf(InvalidQueryParameterException.class)
                .hasMessage("size must be <= 100");
    }

    @Test
    void toPageable_rejectsUnknownSortProperty() {
        assertThatThrownBy(() -> TicketListQuerySupport.toPageable(0, 20, "assignee,asc"))
                .isInstanceOf(InvalidQueryParameterException.class)
                .hasMessageContaining("Invalid sort property 'assignee'");
    }

    @Test
    void toPageable_rejectsMalformedSort() {
        assertThatThrownBy(() -> TicketListQuerySupport.toPageable(0, 20, "createdAt"))
                .isInstanceOf(InvalidQueryParameterException.class)
                .hasMessageContaining("sort must be in the form property,direction");
    }

    @Test
    void toPageable_rejectsInvalidSortDirection() {
        assertThatThrownBy(() -> TicketListQuerySupport.toPageable(0, 20, "createdAt,up"))
                .isInstanceOf(InvalidQueryParameterException.class)
                .hasMessage("sort direction must be 'asc' or 'desc'");
    }
}
