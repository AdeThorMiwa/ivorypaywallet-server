import { NextFunction, Request, Response } from 'express';
import JWT, { Algorithm } from 'jsonwebtoken';
import config from 'config';
import { Unauthorized } from 'http-errors';
import { AuthRequest } from '../interfaces';

export const requireAuthentication = (scopes?: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return next(new Unauthorized('Invalid or missing token'));
    }

    try {
      const jwtPayload = JWT.verify(token, <string>process.env.JWT_SECRET, {
        complete: true,
        audience: config.get<string>('jwt.audience'),
        issuer: config.get<string>('jwt.issuer'),
        algorithms: [config.get<Algorithm>('jwt.algo')],
        clockTolerance: 0,
        ignoreExpiration: false,
        ignoreNotBefore: false,
      });

      const { email, userId, scopes: payloadScopes } = <Record<string, unknown>>jwtPayload.payload;
      (<AuthRequest>req).auth = {
        email: email as string,
        userId: userId as string,
      };

      // validate scopes
      if (scopes?.length) {
        scopes.forEach(scope => {
          const scopeNotFound = !(payloadScopes as string[]).find(scope_ => scope_ === scope);
          if (scopeNotFound) {
            return next(new Unauthorized('Invalid or missing token'));
          }
        });
      }
    } catch {
      return next(new Unauthorized('Invalid or missing token'));
    }

    next();
  };
};
