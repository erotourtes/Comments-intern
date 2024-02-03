import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

type CodeError = {
  [key in Prisma.PrismaClientKnownRequestError['code']]: (
    error: Prisma.PrismaClientKnownRequestError,
  ) => string;
};

const codeError: CodeError = {
  P2002: (error) => `Unique constraint failed: ${error.meta.target}`,
  P2003: (error) => `A constraint failed: ${error.meta.target}`,
  P2004: (error) => `Null constraint failed: ${error.meta.target}`,
  P2025: (error) =>
    `An error occured: ${error.meta.target}. Maybe it doesn't exist?`,
  default: () => `An error occurred while processing your request`,
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter<
  T extends Prisma.PrismaClientKnownRequestError,
> implements ExceptionFilter
{
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorMessageProvider = codeError[exception.code] || codeError.default;
    const errorMessage = errorMessageProvider(exception);

    response.status(400).json({
      error: `Database error: ${errorMessage}`,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
