import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { IError } from './error.interface';

export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, errorCode: null };

    const responseData = {
      ...{
        ...message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    this.logMessage(request, message, status, exception);

    return response.status(status).json(responseData);
  }

  private logMessage(
    request: any,
    message: IError,
    status: number,
    exception: any,
  ): void {
    if (status === 500) {
      this.logger.error(
        `Request From ${request.path}`,
        `Method : ${request.method}, Status : ${status}, errorCode: ${
          message.errorCode ? message.errorCode : null
        } Message : ${message.message ? message.message : null}`,
        status >= 500 ? exception.stack : '',
      );
    }
  }
}
