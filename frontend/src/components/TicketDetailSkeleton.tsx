export function TicketDetailSkeleton() {
  return (
    <div className="ticket-detail-skeleton" aria-busy="true" aria-label="Loading ticket">
      <div className="skeleton skeleton-header" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card" />
      <div className="skeleton skeleton-card skeleton-card-short" />
    </div>
  );
}
