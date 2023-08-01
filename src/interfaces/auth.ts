import { Request } from 'express';

export interface InviteUserRequestBody {
  email: string;
}

export interface AuthRequest extends Request {
  auth: { email?: string; userId?: string };
}
