import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import UserService from '../services/UserService';
import { CreateUserRequest } from '../interfaces/user';
import { AuthRequest } from '../interfaces';
import { Forbidden } from 'http-errors';

@Service()
class UserController {
  constructor(@Inject() readonly userService: UserService) {}

  public createUser = async (req: Request, res: Response) => {
    const email = this._getEmailFromRequest(<AuthRequest>req);
    const body = <CreateUserRequest>req.body;
    const response = await this.userService.createUser(email, body.username, body.password);
    res.status(201).json(response);
  };

  public getAuthenticatedUser = async (req: Request, res: Response) => {
    const userId = this._getUserIdFromRequest(<AuthRequest>req);
    const response = await this.userService.getUserById(userId);
    res.status(200).json(response);
  };

  private _getEmailFromRequest = (req: AuthRequest): string => {
    if (!req.auth.email) {
      throw new Forbidden('Could not authenticate');
    }
    return req.auth.email;
  };

  private _getUserIdFromRequest = (req: AuthRequest): string => {
    if (!req.auth.userId) {
      throw new Forbidden('Could not authenticate');
    }
    return req.auth.userId;
  };
}

export default UserController;
