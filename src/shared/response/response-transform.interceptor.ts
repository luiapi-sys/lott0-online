import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseFactory } from './response.factory';

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, unknown>
{
  intercept(
    _ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          'success' in data
        ) {
          return data;
        }
        return ResponseFactory.ok(data ?? null);
      }),
    );
  }
}
