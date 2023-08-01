import { Application } from 'express';
import AuthRouter from './AuthRoutes';
import UserRouter from './UserRoutes';
import WalletRouter from './WalletRoutes';

export default class RouteManager {
  static setupRoutes(app: Application) {
    app.use('/auth', AuthRouter);
    app.use('/users', UserRouter);
    app.use('/wallets', WalletRouter);
  }
}
