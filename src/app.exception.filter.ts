import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class UnhandledExceptionFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorMessage = 'Internal server error. Please try again later.';

    response.status(400).json({
      error: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const classValidatorResponse = (exception as any).response;
    if (classValidatorResponse) {
      const statusCode = classValidatorResponse.statusCode || 400;
      return void response.status(statusCode).json(classValidatorResponse);
    }

    const status = exception.getStatus();
    const message = exception.message || 'Internal Server Error';

    response.status(status).json({
      message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
