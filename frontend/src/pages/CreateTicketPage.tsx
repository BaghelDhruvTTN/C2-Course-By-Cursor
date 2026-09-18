import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage, mapFieldErrors } from '../api/errors';
import { ApiError } from '../api/client';
import { createTicket } from '../api/tickets';
import { ErrorBanner } from '../components/ErrorBanner';
import { TicketForm } from '../components/TicketForm';
import type { CreateTicketRequest } from '../types/ticket';

export function CreateTicketPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(request: CreateTicketRequest) {
    setSubmitting(true);
    setGeneralError('');
    setFieldErrors({});

    try {
      const ticket = await createTicket(request);
      navigate(`/tickets/${ticket.id}`);
    } catch (error) {
      if (error instanceof ApiError && (error.fieldErrors?.length ?? 0) > 0) {
        setFieldErrors(mapFieldErrors(error.fieldErrors));
        if (error.message && error.message !== 'Validation failed') {
          setGeneralError(error.message);
        }
      } else {
        setGeneralError(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="create-ticket-page">
      <h1>Create Ticket</h1>

      {generalError && <ErrorBanner message={generalError} />}

      <TicketForm
        submitting={submitting}
        fieldErrors={fieldErrors}
        onSubmit={(request) => void handleSubmit(request)}
        onCancel={() => navigate('/')}
      />
    </section>
  );
}
