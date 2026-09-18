import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiError } from '../api/client';
import { getDetailLoadErrorMessage, getErrorMessage, mapFieldErrors } from '../api/errors';
import { addComment, getTicket, transitionStatus, updateTicket } from '../api/tickets';
import {
  TicketDetailLoadingState,
  TicketLoadErrorState,
  TicketNotFoundState,
} from '../components/TicketDetailLoadState';
import { TicketDetail } from '../components/TicketDetail';
import type { CreateCommentRequest, TicketResponse, TicketStatus, UpdateTicketRequest } from '../types/ticket';

export function TicketDetailPage() {
  const { id } = useParams();
  const ticketId = Number(id);

  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [updateError, setUpdateError] = useState('');
  const [statusError, setStatusError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentFieldErrors, setCommentFieldErrors] = useState<Record<string, string>>({});
  const [commentError, setCommentError] = useState('');

  const loadTicket = useCallback(async (isRetry = false) => {
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      setNotFound(true);
      setTicket(null);
      setLoading(false);
      setLoadError('');
      return;
    }

    if (isRetry) {
      setRetrying(true);
    } else {
      setLoading(true);
    }
    setNotFound(false);
    setLoadError('');

    try {
      const response = await getTicket(ticketId);
      setTicket(response);
    } catch (err) {
      setTicket(null);
      if (err instanceof ApiError && err.status === 404) {
        setNotFound(true);
      } else {
        setLoadError(getDetailLoadErrorMessage(err));
      }
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [ticketId]);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  async function handleTransition(newStatus: TicketStatus) {
    setTransitioning(true);
    setStatusError('');

    try {
      const updated = await transitionStatus(ticketId, { status: newStatus });
      setTicket(updated);
    } catch (err) {
      if (err instanceof ApiError) {
        setStatusError(err.message);
      } else {
        setStatusError(getErrorMessage(err));
      }
    } finally {
      setTransitioning(false);
    }
  }

  async function handleAddComment(request: CreateCommentRequest) {
    setCommentSubmitting(true);
    setCommentError('');
    setCommentFieldErrors({});

    try {
      const comment = await addComment(ticketId, request);
      setTicket((current) =>
        current ? { ...current, comments: [...current.comments, comment] } : current
      );
    } catch (err) {
      if (err instanceof ApiError && (err.fieldErrors?.length ?? 0) > 0) {
        setCommentFieldErrors(mapFieldErrors(err.fieldErrors));
        if (err.message && err.message !== 'Validation failed') {
          setCommentError(err.message);
        }
      } else {
        setCommentError(getErrorMessage(err));
      }
      throw err;
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function handleUpdate(request: UpdateTicketRequest) {
    setSubmitting(true);
    setUpdateError('');
    setFieldErrors({});
    setSaveSuccess(false);
    setStatusError('');

    try {
      const updated = await updateTicket(ticketId, request);
      setTicket(updated);
      setSaveSuccess(true);
    } catch (err) {
      if (err instanceof ApiError && (err.fieldErrors?.length ?? 0) > 0) {
        setFieldErrors(mapFieldErrors(err.fieldErrors));
        if (err.message && err.message !== 'Validation failed') {
          setUpdateError(err.message);
        }
      } else {
        setUpdateError(getErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <TicketDetailLoadingState />;
  }

  if (notFound) {
    return <TicketNotFoundState />;
  }

  if (loadError) {
    return (
      <TicketLoadErrorState
        title={`Ticket #${id}`}
        message={loadError}
        retrying={retrying}
        onRetry={() => void loadTicket(true)}
      />
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <section className="ticket-detail-page">
      <TicketDetail
        ticket={ticket}
        submitting={submitting}
        transitioning={transitioning}
        saveSuccess={saveSuccess}
        fieldErrors={fieldErrors}
        updateError={updateError}
        statusError={statusError}
        commentSubmitting={commentSubmitting}
        commentFieldErrors={commentFieldErrors}
        commentError={commentError}
        onUpdate={(request) => void handleUpdate(request)}
        onTransition={(status) => void handleTransition(status)}
        onAddComment={handleAddComment}
      />
    </section>
  );
}
