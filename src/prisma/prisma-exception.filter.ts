import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BaseExceptionFilter } from '@nestjs/core';

const knownErrors: Record<string, { status: HttpStatus; metaKey: string }> = {
  P2002: { status: HttpStatus.CONFLICT, metaKey: 'details' },
  P2025: { status: HttpStatus.UNPROCESSABLE_ENTITY, metaKey: 'cause' },
};

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code in knownErrors) {
      const knowError = knownErrors[exception.code];
      response.status(knowError.status).json({
        statusCode: knowError.status,
        message: exception.meta[knowError.metaKey] ?? exception.message,
      });
    } else {
      // default 500 error code
      super.catch(exception, host);
    }
  }
}
