import type { CreateCommentRequest, TicketResponse, TicketStatus, UpdateTicketRequest } from '../types/ticket';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';
import { ErrorBanner } from './ErrorBanner';
import { PriorityBadge } from './PriorityBadge';
import { StatusActions } from './StatusActions';
import { StatusBadge } from './StatusBadge';
import { TicketUpdateForm } from './TicketUpdateForm';

interface TicketDetailProps {
  ticket: TicketResponse;
  submitting?: boolean;
  transitioning?: boolean;
  saveSuccess?: boolean;
  fieldErrors: Record<string, string>;
  updateError?: string;
  statusError?: string;
  commentSubmitting?: boolean;
  commentFieldErrors: Record<string, string>;
  commentError?: string;
  onUpdate: (request: UpdateTicketRequest) => void;
  onTransition: (status: TicketStatus) => void;
  onAddComment: (request: CreateCommentRequest) => Promise<void>;
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TicketDetail({
  ticket,
  submitting = false,
  transitioning = false,
  saveSuccess = false,
  fieldErrors,
  updateError = '',
  statusError = '',
  commentSubmitting = false,
  commentFieldErrors,
  commentError = '',
  onUpdate,
  onTransition,
  onAddComment,
}: TicketDetailProps) {
  return (
    <article className="ticket-detail">
      <header className="ticket-detail-header">
        <h1>Ticket #{ticket.id}</h1>
        <div className="ticket-detail-badges">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </header>

      <section className="detail-card" aria-labelledby="details-heading">
        <h2 id="details-heading">Details</h2>
        {updateError && <ErrorBanner message={updateError} />}
        <TicketUpdateForm
          ticket={ticket}
          submitting={submitting}
          fieldErrors={fieldErrors}
          saveSuccess={saveSuccess}
          onSubmit={onUpdate}
        />
      </section>

      <StatusActions
        status={ticket.status}
        transitioning={transitioning}
        error={statusError}
        onTransition={onTransition}
      />

      <section className="detail-card" aria-labelledby="comments-heading">
        <h2 id="comments-heading">Comments</h2>
        <CommentList comments={ticket.comments} />
        <CommentForm
          submitting={commentSubmitting}
          fieldErrors={commentFieldErrors}
          error={commentError}
          onSubmit={onAddComment}
        />
      </section>

      <section className="detail-card detail-metadata" aria-labelledby="metadata-heading">
        <h2 id="metadata-heading">Metadata</h2>
        <dl className="detail-fields detail-fields-inline">
          <div className="detail-field">
            <dt>Created</dt>
            <dd>
              <time dateTime={ticket.createdAt}>{formatDateTime(ticket.createdAt)}</time>
            </dd>
          </div>
          <div className="detail-field">
            <dt>Updated</dt>
            <dd>
              <time dateTime={ticket.updatedAt}>{formatDateTime(ticket.updatedAt)}</time>
            </dd>
          </div>
        </dl>
      </section>
    </article>
  );
}
