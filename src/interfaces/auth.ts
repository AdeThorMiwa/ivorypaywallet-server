import { Request } from 'express';

export interface InviteUserRequestBody {
  email: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthRequest extends Request {
  auth: { email?: string; userId?: string; isAdmin: boolean };
}
