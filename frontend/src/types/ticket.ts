export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: FieldError[];
}

export interface CommentResponse {
  id: number;
  body: string;
  author: string;
  createdAt: string;
}

export interface TicketSummary {
  id: number;
  title: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketResponse {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
  comments: CommentResponse[];
}

export interface PagedTicketResponse {
  content: TicketSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: Priority;
}

export interface UpdateTicketRequest {
  title: string;
  description: string;
  priority: Priority;
  assignee: string | null;
}

export interface StatusTransitionRequest {
  status: TicketStatus;
}

export interface CreateCommentRequest {
  body: string;
  author: string;
}

export interface ListTicketsParams {
  keyword?: string;
  status?: TicketStatus;
  page?: number;
  size?: number;
}
