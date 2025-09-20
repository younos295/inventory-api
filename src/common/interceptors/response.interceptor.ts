import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUCCESS_MESSAGE_KEY } from '../decorators/success-message.decorator';

interface StandardSuccess<T = any> {
  message: string;
  data: T;
  statusCode: number;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const res = context.switchToHttp().getResponse();
        const statusCode: number = res?.statusCode ?? 200;
        // Resolve custom success message from metadata if provided
        const customMessage = this.reflector.getAllAndOverride<string>(SUCCESS_MESSAGE_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);

        // If already standardized, pass through
        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'statusCode' in data &&
          (('data' in data && !('error' in data)) || ('error' in data && !('data' in data)))
        ) {
          return { statusCode: data.statusCode, message: data.message, data: data.data };
        }

        // If controller returned { message, ...rest } but not wrapped, use that message
        let message = customMessage || 'Success';
        if (data && typeof data === 'object' && 'message' in data && typeof (data as any).message === 'string') {
          message = (data as any).message as string;
          // Avoid duplicating message inside data payload if present at top-level
          const { message: _omit, ...rest } = data as Record<string, any>;
          return { statusCode, message, data: rest } as StandardSuccess;
        }

        // Default wrap
        return { statusCode, message, data } as StandardSuccess;
      }),
    );
  }
}
