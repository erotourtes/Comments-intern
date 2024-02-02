import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
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
