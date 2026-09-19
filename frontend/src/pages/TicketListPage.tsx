import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/errors';
import { listTickets } from '../api/tickets';
import { ErrorBanner } from '../components/ErrorBanner';
import { SearchBar } from '../components/SearchBar';
import { StatusFilter } from '../components/StatusFilter';
import { TicketTable } from '../components/TicketTable';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import type { PagedTicketResponse, TicketStatus } from '../types/ticket';

const PAGE_SIZE = 20;

export function TicketListPage() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PagedTicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedKeyword = useDebouncedValue(keyword);
  const filtersRef = useRef({ debouncedKeyword, status });

  const handleStatusChange = useCallback((value: TicketStatus | '') => {
    setStatus(value);
    setPage(0);
  }, []);

  const loadTickets = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await listTickets({
        keyword: debouncedKeyword || undefined,
        status: status || undefined,
        page: pageToFetch,
        size: PAGE_SIZE,
      });
      setData(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, status]);

  useEffect(() => {
    const filtersChanged =
      filtersRef.current.debouncedKeyword !== debouncedKeyword
          || filtersRef.current.status !== status;

    if (filtersChanged) {
      filtersRef.current = { debouncedKeyword, status };
      if (page !== 0) {
        setPage(0);
        return;
      }
    }

    void loadTickets(page);
  }, [debouncedKeyword, status, page, loadTickets]);

  const totalPages = data?.totalPages ?? 0;
  const tickets = data?.content ?? [];
  const showTable = tickets.length > 0;
  const showEmpty = !loading && !error && tickets.length === 0;

  return (
    <section className="ticket-list-page">
      <h1>Tickets</h1>

      <div className="list-toolbar">
        <SearchBar value={keyword} onChange={setKeyword} />
        <StatusFilter value={status} onChange={handleStatusChange} />
      </div>

      {error && (
        <div className="error-with-retry">
          <ErrorBanner message={error} />
          <button
            type="button"
            className="button"
            disabled={loading}
            onClick={() => void loadTickets(page)}
          >
            {loading ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      )}

      {loading && !data && <p className="loading-state">Loading tickets…</p>}

      {loading && data && <p className="loading-state loading-state-inline">Refreshing…</p>}

      {showTable && <TicketTable tickets={tickets} />}

      {showEmpty && <p className="empty-state">No tickets found</p>}

      {showTable && totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="button"
            disabled={page === 0 || loading}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            className="button"
            disabled={page >= totalPages - 1 || loading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
