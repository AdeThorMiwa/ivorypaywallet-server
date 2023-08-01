import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { InviteUserRequestBody, LoginRequestBody } from '../interfaces';

@Service()
class AuthController {
  constructor(@Inject() readonly authService: AuthService) {}

  public invite = async (req: Request, res: Response) => {
    const body = <InviteUserRequestBody>req.body;
    const response = await this.authService.sendInviteToUser(body.email);
    res.status(200).json(response);
  };

  public login = async (req: Request, res: Response) => {
    const body = <LoginRequestBody>req.body;
    const response = await this.authService.authenticateUser(body.email, body.password);
    res.status(200).json(response);
  };
}

export default AuthController;
