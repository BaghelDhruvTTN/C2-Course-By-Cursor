import { useCallback, useEffect, useState } from 'react';
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

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await listTickets({
        keyword: debouncedKeyword || undefined,
        status: status || undefined,
        page,
        size: PAGE_SIZE,
      });
      setData(response);
    } catch (err) {
      setData(null);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, status, page]);

  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, status]);

  const totalPages = data?.totalPages ?? 0;
  const tickets = data?.content ?? [];

  return (
    <section className="ticket-list-page">
      <h1>Tickets</h1>

      <div className="list-toolbar">
        <SearchBar value={keyword} onChange={setKeyword} />
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      {error && <ErrorBanner message={error} />}

      {loading ? (
        <p className="loading-state">Loading tickets…</p>
      ) : error ? null : tickets.length === 0 ? (
        <p className="empty-state">No tickets found</p>
      ) : (
        <>
          <TicketTable tickets={tickets} />
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="button"
                disabled={page === 0}
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
                disabled={page >= totalPages - 1}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
