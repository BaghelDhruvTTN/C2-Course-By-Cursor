import type { ErrorResponse } from '../types/ticket';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
const API_KEY = import.meta.env.VITE_API_KEY ?? '';

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ErrorResponse['fieldErrors'];

  constructor(response: ErrorResponse) {
    super(response.message);
    this.name = 'ApiError';
    this.status = response.status;
    this.fieldErrors = response.fieldErrors ?? [];
  }
}

function isGatewayError(status: number): boolean {
  return status === 502 || status === 503 || status === 504;
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  if (!isJson || isGatewayError(response.status)) {
    return new ApiError({
      timestamp: new Date().toISOString(),
      status: response.status,
      error: response.statusText,
      message: isGatewayError(response.status)
        ? 'Unable to connect to server'
        : 'Request failed',
      path: '',
      fieldErrors: [],
    });
  }

  try {
    const body = (await response.json()) as ErrorResponse;
    return new ApiError(body);
  } catch {
    return new ApiError({
      timestamp: new Date().toISOString(),
      status: response.status,
      error: response.statusText,
      message: 'Request failed',
      path: '',
      fieldErrors: [],
    });
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (API_KEY && !headers.has('X-API-Key')) {
    headers.set('X-API-Key', API_KEY);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
