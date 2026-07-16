import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseFactory, ERROR_CODES } from './response.factory';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = ERROR_CODES.INTERNAL_ERROR.code;
    let message = 'Internal server error';
    let details: unknown[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const r = res as Record<string, unknown>;
        message = (r.message as string) ?? message;
        code = (r.error as string) ?? this.httpCodeToError(status);
        details = r.details as unknown[] | undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json(ResponseFactory.error(code, message, details));
  }

  private httpCodeToError(status: number): string {
    switch (status) {
      case 400:
        return ERROR_CODES.VALIDATION_ERROR.code;
      case 401:
        return ERROR_CODES.UNAUTHORIZED.code;
      case 403:
        return ERROR_CODES.FORBIDDEN.code;
      case 404:
        return ERROR_CODES.NOT_FOUND.code;
      case 409:
        return ERROR_CODES.CONFLICT.code;
      default:
        return ERROR_CODES.INTERNAL_ERROR.code;
    }
  }
}
