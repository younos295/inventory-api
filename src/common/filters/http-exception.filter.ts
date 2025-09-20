import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface StandardError {
  message: string;
  error: any;
  statusCode: number;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      // Nest/Validation may return string | object
      if (typeof res === 'string') {
        message = res;
        error = undefined;
      } else if (res && typeof res === 'object') {
        const r: any = res;
        const rawMsg = r.message ?? r.error ?? exception.message ?? 'Error';
        // If validation error returns array of messages, keep a generic top-level message
        if (Array.isArray(rawMsg)) {
          message = typeof r.error === 'string' ? r.error : 'Validation failed';
        } else {
          message = rawMsg;
        }

        // Build error details without duplicating message/statusCode
        const details: any = { ...r };
        delete details.message;
        delete details.statusCode;

        // Normalize validation messages under `errors`
        if (Array.isArray(r.message)) {
          details.errors = r.message;
        }

        // If resulting details is empty, set undefined to avoid empty object noise
        const keys = Object.keys(details);
        if (!keys.length) {
          error = undefined;
        } else if (keys.length === 1 && keys[0] === 'error' && typeof details.error === 'string') {
          // Collapse to a simple string for cleaner payloads
          error = details.error;
        } else {
          error = details;
        }
      } else {
        message = exception.message || 'Error';
        error = undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      error = {
        name: exception.name,
        stack: process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      };
    } else {
      error = exception;
    }

    const body: StandardError = {
      statusCode,
      message,
      error,
    } as any;

    response.status(statusCode).json(body);
  }
}
