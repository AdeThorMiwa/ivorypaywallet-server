import { Server } from 'http';
import { AppLogger } from '.';
import { NextFunction, Request, Response } from 'express';
import { BadRequest, HttpError, InternalServerError, isHttpError } from 'http-errors';
import { validationResult } from 'express-validator';
import config from 'config';

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

  const baseError = <HttpError>error;

  if (baseError.statusCode >= INTERNAL_SERVER_ERROR_CODE) {
    try {
      AppLogger.error({
        method: req.method,
        url: req.url,
        clientInfo: req.headers['user-agent'],
        status: baseError.statusCode,
        message: baseError.message,
        stack: baseError.stack,
      });
    } catch (e) {}
  }

  const errObject: Record<string, unknown> = {
    name: baseError.name,
    message: baseError.message,
    statusCode: baseError.statusCode,
  };

  if (config.util.getEnv('NODE_ENV') !== 'production') {
    errObject.stack = baseError.stack;
  }

  return res.status(baseError.statusCode).json(errObject);
};

export const throwValidationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorSet = new Set();
    errors.array().forEach(er => {
      errorSet.add(`${er.msg}`);
    });

    return next(new BadRequest(`Invalid or missing params: ${Array.from(errorSet.values())}`));
  }
  next();
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
