import { Service } from 'typedi';
import bcrypt from 'bcrypt';
import config from 'config';

@Service()
class EncryptionService {
  public passwordEncrypt = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, config.get<number>('encryption.password.salt'));
  };
}

export default EncryptionService;
