import { apiRequest } from './client';
import type {
  CommentResponse,
  CreateCommentRequest,
  CreateTicketRequest,
  ListTicketsParams,
  PagedTicketResponse,
  StatusTransitionRequest,
  TicketResponse,
  UpdateTicketRequest,
} from '../types/ticket';

function buildQuery(params: ListTicketsParams): string {
  const searchParams = new URLSearchParams();
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.size !== undefined) {
    searchParams.set('size', String(params.size));
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function listTickets(params: ListTicketsParams = {}): Promise<PagedTicketResponse> {
  return apiRequest<PagedTicketResponse>(`/api/tickets${buildQuery(params)}`);
}

export function getTicket(id: number): Promise<TicketResponse> {
  return apiRequest<TicketResponse>(`/api/tickets/${id}`);
}

export function createTicket(request: CreateTicketRequest): Promise<TicketResponse> {
  return apiRequest<TicketResponse>('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateTicket(id: number, request: UpdateTicketRequest): Promise<TicketResponse> {
  return apiRequest<TicketResponse>(`/api/tickets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

export function transitionStatus(
  id: number,
  request: StatusTransitionRequest
): Promise<TicketResponse> {
  return apiRequest<TicketResponse>(`/api/tickets/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(request),
  });
}

export function addComment(
  id: number,
  request: CreateCommentRequest
): Promise<CommentResponse> {
  return apiRequest<CommentResponse>(`/api/tickets/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
