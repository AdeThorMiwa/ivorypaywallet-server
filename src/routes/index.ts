import { Application } from 'express';
import AuthRouter from './AuthRoutes';
import UserRouter from './UserRoutes';

export default class RouteManager {
  static setupRoutes(app: Application) {
    app.use('/auth', AuthRouter);
    app.use('/users', UserRouter);
  }
}
