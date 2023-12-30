import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.getArgByIndex(1);
    const request = ctx;
    // // // console.log(request.req.rawHeaders);
    return next.handle().pipe(
      map((data) => {
        return {
          /* accessToken : request.req.rawHeaders[7], */
          statusCode: request.statusCode,
          error: false,
          data,
        };
      }),
    );
  }
}
