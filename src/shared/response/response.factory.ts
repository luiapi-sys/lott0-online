export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

export interface ErrorCode {
  code: string;
  status: number;
}

export const ERROR_CODES = {
  VALIDATION_ERROR: { code: 'VALIDATION_ERROR', status: 400 },
  UNAUTHORIZED: { code: 'UNAUTHORIZED', status: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', status: 403 },
  NOT_FOUND: { code: 'NOT_FOUND', status: 404 },
  CONFLICT: { code: 'CONFLICT', status: 409 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', status: 500 },
} as const;

export class ResponseFactory {
  static ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
    return { success: true, data, meta };
  }

  static error(
    code: string,
    message: string,
    details?: unknown[],
  ): ApiError {
    return { success: false, error: { code, message, details } };
  }
}
