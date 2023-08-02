import { Application } from 'express';
import AuthRouter from './AuthRoutes';
import UserRouter from './UserRoutes';
import WalletRouter from './WalletRoutes';
import TransactionRouter from './TransactionRoutes';
import AdminRouter from './AdminRoutes';

export default class RouteManager {
  static setupRoutes(app: Application) {
    app.use('/', (req, res) => res.json({ message: 'Hi there' }));
    app.use('/auth', AuthRouter);
    app.use('/users', UserRouter);
    app.use('/wallets', WalletRouter);
    app.use('/transactions', TransactionRouter);
    app.use('/admins', AdminRouter);
  }
}
