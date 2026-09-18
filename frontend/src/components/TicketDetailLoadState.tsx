import { Link } from 'react-router-dom';
import { LoadingSpinner } from './LoadingSpinner';
import { TicketDetailSkeleton } from './TicketDetailSkeleton';

interface TicketNotFoundStateProps {
  backTo?: string;
  backLabel?: string;
}

export function TicketDetailLoadingState() {
  return (
    <section className="ticket-detail-page ticket-detail-load-state">
      <LoadingSpinner label="Loading ticket…" />
      <TicketDetailSkeleton />
    </section>
  );
}

export function TicketNotFoundState({
  backTo = '/',
  backLabel = 'Back to tickets',
}: TicketNotFoundStateProps) {
  return (
    <section className="ticket-detail-page ticket-detail-load-state">
      <h1>Ticket not found</h1>
      <p className="empty-state">The ticket you are looking for does not exist or may have been removed.</p>
      <Link to={backTo} className="button button-primary">{backLabel}</Link>
    </section>
  );
}

interface TicketLoadErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
  retrying?: boolean;
}

export function TicketLoadErrorState({
  title,
  message,
  onRetry,
  retrying = false,
}: TicketLoadErrorStateProps) {
  return (
    <section className="ticket-detail-page ticket-detail-load-state">
      <h1>{title}</h1>
      <p className="error-banner" role="alert">{message}</p>
      <div className="load-state-actions">
        <button
          type="button"
          className="button button-primary"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? 'Retrying…' : 'Retry'}
        </button>
        <Link to="/" className="button">Back to tickets</Link>
      </div>
    </section>
  );
}
