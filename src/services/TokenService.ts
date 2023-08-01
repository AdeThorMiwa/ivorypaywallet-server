import { Service } from 'typedi';
import JWT, { Algorithm } from 'jsonwebtoken';
import config from 'config';
import { SCOPES } from '../constants';

@Service()
class TokenService {
  constructor() {}

  public newInviteToken = async (email: string): Promise<string> => {
    const payload = {
      email,
      scope: [SCOPES.CAN_CREATE_PROFILE],
    };
    return JWT.sign(payload, <string>process.env.JWT_SECRET, this._getJwtSignOptions());
  };

  private _getJwtSignOptions(): JWT.SignOptions {
    return {
      algorithm: config.get<Algorithm>('jwt.algo'),
      issuer: config.get<string>('jwt.issuer'),
      expiresIn: config.get<string>('jwt.expiry'),
    };
  }
}

export default TokenService;
