import { Server } from 'http';
import { AppLogger } from '.';
import { NextFunction, Request, Response } from 'express';
import { HttpError, InternalServerError, isHttpError } from 'http-errors';

const INTERNAL_SERVER_ERROR_CODE = 500;

export const unhandledErrorHandler = (server: Server) => {
  process.on('uncaughtException', (err: Error) => {
    AppLogger.error(err);
    AppLogger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('unhandledRejection', (err: Error) => {
    AppLogger.error(err);
    AppLogger.info('UNHANDLED REJECTION! 💥 Shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    AppLogger.info('👋 SIGTERM RECEIVED. Shutting down gracefully!');
    server.close(() => {
      process.exit(1);
    });
  });
};

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (!isHttpError(error)) {
    // it means it is a server generated error
    const e = error;
    error = new InternalServerError(
      e.message || 'An error occurred while processing your request. We are looking into it.',
    );
  }

  const includeStackTrace = process.env.NODE_ENV !== 'production';
  const baseError = <HttpError>error;
  const errorData = baseError.getErrorData(includeStackTrace);

  if (baseError.statusCode >= INTERNAL_SERVER_ERROR_CODE) {
    try {
      AppLogger.error({
        method: req.method,
        url: req.url,
        clientInfo: req.headers['user-agent'],
        status: baseError.statusCode,
        message: errorData.message,
        stack: baseError.stack,
      });
    } catch (e) {}
  }

  return res.status(baseError.statusCode).send(errorData);
};
