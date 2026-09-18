import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateTicketRequest, Priority } from '../types/ticket';
import { FieldError } from './FieldError';

const PRIORITY_OPTIONS: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

interface TicketFormProps {
  submitting?: boolean;
  fieldErrors: Record<string, string>;
  onSubmit: (request: CreateTicketRequest) => void;
  onCancel: () => void;
}

export function TicketForm({ submitting = false, fieldErrors, onSubmit, onCancel }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ title, description, priority });
  }

  return (
    <form className="ticket-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="form-label" htmlFor="title">Title</label>
        <input
          id="title"
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
        <label className="form-label" htmlFor="description">Description</label>
        <textarea
          id="description"
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
        <label className="form-label" htmlFor="priority">Priority</label>
        <select
          id="priority"
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

      <div className="form-actions">
        <button type="button" className="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}
