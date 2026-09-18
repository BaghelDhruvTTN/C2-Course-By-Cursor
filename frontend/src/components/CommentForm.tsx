import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateCommentRequest } from '../types/ticket';
import { ErrorBanner } from './ErrorBanner';
import { FieldError } from './FieldError';

interface CommentFormProps {
  submitting?: boolean;
  fieldErrors: Record<string, string>;
  error?: string;
  onSubmit: (request: CreateCommentRequest) => Promise<void>;
}

export function CommentForm({
  submitting = false,
  fieldErrors,
  error = '',
  onSubmit,
}: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await onSubmit({ author, body });
      setAuthor('');
      setBody('');
    } catch {
      // Errors are displayed via props from the parent.
    }
  }

  return (
    <form className="comment-form" onSubmit={(event) => void handleSubmit(event)} noValidate>
      {error && <ErrorBanner message={error} />}

      <div className="form-field">
        <label className="form-label" htmlFor="comment-author">Author</label>
        <input
          id="comment-author"
          name="author"
          type="text"
          className={`form-input${fieldErrors.author ? ' form-input-invalid' : ''}`}
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          maxLength={100}
          required
          disabled={submitting}
        />
        <FieldError message={fieldErrors.author} />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="comment-body">Comment</label>
        <textarea
          id="comment-body"
          name="body"
          className={`form-input form-textarea${fieldErrors.body ? ' form-input-invalid' : ''}`}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={5000}
          rows={4}
          required
          disabled={submitting}
        />
        <FieldError message={fieldErrors.body} />
      </div>

      <div className="form-actions">
        <button type="submit" className="button button-primary" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add comment'}
        </button>
      </div>
    </form>
  );
}
