import { Service } from 'typedi';
import JWT, { Algorithm } from 'jsonwebtoken';
import config from 'config';
import { SCOPES } from '../constants';
import { UserType } from '../interfaces';

@Service()
class TokenService {
  constructor() {}

  public newInviteToken = async (email: string, userType: UserType): Promise<string> => {
    const payload = {
      email,
      scopes: [userType === UserType.ADMIN ? SCOPES.ADMIN_INVITE : SCOPES.INVITE],
    };
    return this._sign(payload, config.get<string>('jwt.expiry.invite_token'));
  };

  public generateAuthToken = async (userId: string, scopes: string[]) => {
    const payload = {
      userId,
      scopes,
    };
    return this._sign(payload, config.get<string>('jwt.expiry.auth_token'));
  };

  private _sign(payload: Record<string, unknown>, expiry: string): string {
    return JWT.sign(payload, <string>process.env.JWT_SECRET, this._getJwtSignOptions(expiry));
  }

  private _getJwtSignOptions(expiresIn: string): JWT.SignOptions {
    return {
      algorithm: config.get<Algorithm>('jwt.algo'),
      issuer: config.get<string>('jwt.issuer'),
      audience: config.get<string>('jwt.audience'),
      expiresIn,
      notBefore: '0',
    };
  }
}

export default TokenService;
