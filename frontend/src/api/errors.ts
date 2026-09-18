import { ApiError } from './client';
import type { FieldError } from '../types/ticket';

export const CONNECTION_ERROR_SHORT = 'Unable to connect to server';

const CONNECTION_ERROR_MESSAGE =
  'Unable to connect to server. Please ensure the backend is running on port 8080.';

export function isConnectionError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return true;
  }
  if (error instanceof ApiError) {
    return (
      error.status === 502 ||
      error.status === 503 ||
      error.status === 504 ||
      error.message === CONNECTION_ERROR_SHORT ||
      error.message === 'Request failed'
    );
  }
  return false;
}

export function getDetailLoadErrorMessage(error: unknown): string {
  if (isConnectionError(error)) {
    return CONNECTION_ERROR_SHORT;
  }
  return getErrorMessage(error);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return CONNECTION_ERROR_MESSAGE;
  }
  if (error instanceof ApiError) {
    if (isConnectionError(error)) {
      return CONNECTION_ERROR_MESSAGE;
    }
    if (error.status >= 500) {
      return 'Something went wrong. Please try again.';
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

export function mapFieldErrors(fieldErrors: FieldError[] = []): Record<string, string> {
  return fieldErrors.reduce<Record<string, string>>((acc, fieldError) => {
    acc[fieldError.field] = fieldError.message;
    return acc;
  }, {});
}
