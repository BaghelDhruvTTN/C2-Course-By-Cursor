import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listTickets } from '../api/tickets';
import { TicketListPage } from './TicketListPage';

vi.mock('../api/tickets', () => ({
  listTickets: vi.fn(),
}));

const emptyPage = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0,
};

function renderListPage() {
  return render(
    <MemoryRouter>
      <TicketListPage />
    </MemoryRouter>
  );
}

describe('TicketListPage search', () => {
  beforeEach(() => {
    vi.mocked(listTickets).mockResolvedValue(emptyPage);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('debounces search keyword before calling the API', async () => {
    renderListPage();

    await act(async () => {
      await Promise.resolve();
    });

    expect(listTickets).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search tickets' }), {
      target: { value: 'login' },
    });

    expect(listTickets).toHaveBeenCalledTimes(1);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(listTickets).toHaveBeenLastCalledWith({
      keyword: 'login',
      status: undefined,
      page: 0,
      size: 20,
    });
  });
});
