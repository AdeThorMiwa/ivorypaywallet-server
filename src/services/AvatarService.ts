import { Service } from 'typedi';
import { DicebearConfig } from '../interfaces/avatar';

@Service()
class AvatarService {
  private readonly avatars = ['Oreo', 'Bandit', 'Bailey', 'Scooter'];
  private readonly DiceBearBaseUrl = 'https://api.dicebear.com/6.x/thumbs/svg'; // TODO: move to config file

  public getRandomAvatar = async (): Promise<string> => {
    const randomAvatar = this.avatars[Math.floor(Math.random() * this.avatars.length)];
    const avatarUrl = `${this.DiceBearBaseUrl}?seed=${randomAvatar}`;
    return this.applyConfig(avatarUrl, this.getDicebearConfig());
  };

  private getDicebearConfig = (): DicebearConfig => {
    // TODO: move to config file
    return {
      flip: true,
      radius: 50,
    };
  };

  private applyConfig = (avatarUrl: string, configs: DicebearConfig): string => {
    for (const config in configs) {
      avatarUrl += `&${config}=${configs[config as keyof DicebearConfig]}`;
    }
    return avatarUrl;
  };
}

export default AvatarService;
