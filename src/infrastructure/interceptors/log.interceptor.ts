import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    const ip = this.getIp(request);

    this.logger.log(
      `Incoming request on ${request.path}`,
      `Method: ${request.method} IP: ${ip}`,
    );

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `End request for ${request.path}`,
          `Method: ${request.method} duration: ${Date.now() - now}ms`,
        );
      }),
    );
  }

  private getIp(request: Request): string {
    let ip: string;
    const ipAddr = request.headers['x-forwarded-for'];
    if (ipAddr) {
      const list = ipAddr.toString().split(',');
      ip = list[list.length - 1];
    }

    return ip;
  }
}
