import { Service } from 'typedi';
import bcrypt from 'bcrypt';
import config from 'config';
import { AppLogger } from '../utils';
import { InternalServerError } from 'http-errors';

@Service()
class EncryptionService {
  public passwordEncrypt = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, config.get<number>('encryption.password.salt'));
  };

  public comparePassword = async (password: string, encrypted: string) => {
    try {
      return await bcrypt.compare(password, encrypted);
    } catch (e) {
      AppLogger.error('Error while trying to compare password >>> ', e);
      throw new InternalServerError('Something went wrong');
    }
  };
}

export default EncryptionService;
