import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Priority, TicketResponse, UpdateTicketRequest } from '../types/ticket';
import { FieldError } from './FieldError';

const PRIORITY_OPTIONS: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

interface TicketUpdateFormProps {
  ticket: TicketResponse;
  submitting?: boolean;
  fieldErrors: Record<string, string>;
  saveSuccess?: boolean;
  onSubmit: (request: UpdateTicketRequest) => void;
}

export function TicketUpdateForm({
  ticket,
  submitting = false,
  fieldErrors,
  saveSuccess = false,
  onSubmit,
}: TicketUpdateFormProps) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [priority, setPriority] = useState<Priority>(ticket.priority);
  const [assignee, setAssignee] = useState(ticket.assignee ?? '');

  useEffect(() => {
    setTitle(ticket.title);
    setDescription(ticket.description);
    setPriority(ticket.priority);
    setAssignee(ticket.assignee ?? '');
  }, [ticket.id, ticket.updatedAt, ticket.title, ticket.description, ticket.priority, ticket.assignee]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      title,
      description,
      priority,
      assignee: assignee.trim() === '' ? null : assignee.trim(),
    });
  }

  return (
    <form className="ticket-update-form" onSubmit={handleSubmit} noValidate>
      {saveSuccess && (
        <p className="success-banner" role="status">Changes saved.</p>
      )}

      <div className="form-field">
        <label className="form-label" htmlFor="update-title">Title</label>
        <input
          id="update-title"
          name="title"
          type="text"
          className={`form-input${fieldErrors.title ? ' form-input-invalid' : ''}`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          required
          disabled={submitting}
        />
        <FieldError message={fieldErrors.title} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="update-description">Description</label>
        <textarea
          id="update-description"
          name="description"
          className={`form-input form-textarea${fieldErrors.description ? ' form-input-invalid' : ''}`}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={5000}
          rows={6}
          required
          disabled={submitting}
        />
        <FieldError message={fieldErrors.description} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="update-priority">Priority</label>
        <select
          id="update-priority"
          name="priority"
          className={`form-input${fieldErrors.priority ? ' form-input-invalid' : ''}`}
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
          required
          disabled={submitting}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <FieldError message={fieldErrors.priority} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="update-assignee">Assignee</label>
        <input
          id="update-assignee"
          name="assignee"
          type="text"
          className={`form-input${fieldErrors.assignee ? ' form-input-invalid' : ''}`}
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
          maxLength={100}
          placeholder="e.g. alice@example.com"
          disabled={submitting}
        />
        <FieldError message={fieldErrors.assignee} />
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
