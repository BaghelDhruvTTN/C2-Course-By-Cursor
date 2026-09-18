import type { TicketStatus } from '../types/ticket';
import { ErrorBanner } from './ErrorBanner';

interface StatusAction {
  label: string;
  targetStatus: TicketStatus;
  variant?: 'default' | 'danger';
}

const ACTIONS_BY_STATUS: Record<TicketStatus, StatusAction[]> = {
  OPEN: [
    { label: 'Start Progress', targetStatus: 'IN_PROGRESS' },
    { label: 'Cancel', targetStatus: 'CANCELLED', variant: 'danger' },
  ],
  IN_PROGRESS: [
    { label: 'Mark Resolved', targetStatus: 'RESOLVED' },
    { label: 'Cancel', targetStatus: 'CANCELLED', variant: 'danger' },
  ],
  RESOLVED: [
    { label: 'Close', targetStatus: 'CLOSED' },
  ],
  CLOSED: [],
  CANCELLED: [],
};

interface StatusActionsProps {
  status: TicketStatus;
  transitioning?: boolean;
  error?: string;
  onTransition: (status: TicketStatus) => void;
}

export function StatusActions({
  status,
  transitioning = false,
  error = '',
  onTransition,
}: StatusActionsProps) {
  const actions = ACTIONS_BY_STATUS[status];

  if (actions.length === 0) {
    return null;
  }

  return (
    <section className="detail-card" aria-labelledby="status-actions-heading">
      <h2 id="status-actions-heading">Status</h2>
      {error && <ErrorBanner message={error} />}
      <div className="status-actions">
        {actions.map((action) => (
          <button
            key={action.targetStatus}
            type="button"
            className={`button${action.variant === 'danger' ? ' button-danger' : ' button-primary'}`}
            disabled={transitioning}
            onClick={() => onTransition(action.targetStatus)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}
