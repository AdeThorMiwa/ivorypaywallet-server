import { NextFunction, Request, Response } from 'express';
import JWT, { Algorithm } from 'jsonwebtoken';
import config from 'config';
import { Unauthorized } from 'http-errors';
import { AuthRequest } from '../interfaces';
import { SCOPES } from '../constants';

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

      const { email, userId, scopes: _scopes } = <Record<string, unknown>>jwtPayload.payload;
      const payloadScopes = <string[]>_scopes;
      (<AuthRequest>req).auth = {
        email: email as string,
        userId: userId as string,
        isAdmin:
          payloadScopes.includes(SCOPES.ADMIN_INVITE) || payloadScopes.includes(SCOPES.ADMIN),
      };

      // validate scopes
      if (scopes?.length) {
        scopes.forEach(scope => {
          const scopeNotFound = !payloadScopes.find(scope_ => scope_ === scope);
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
