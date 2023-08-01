import EventEmitter from 'events';
import { Inject, Service } from 'typedi';
import { AppEvents } from '../constants';
import WalletService from './WalletService';

@Service()
class AppEventService {
  private readonly emitter = new EventEmitter();

  constructor(@Inject() readonly walletService: WalletService) {
    this._registerEventHandlers();
  }

  private _registerEventHandlers = () => {
    this.emitter.on(AppEvents.NEW_USER, this.walletService.setupUserWallet);
  };

  public emit = (eventName: keyof typeof AppEvents, ...args: unknown[]) => {
    this.emitter.emit(eventName, ...args);
  };
}

export default AppEventService;
