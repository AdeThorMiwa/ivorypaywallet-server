import { Application } from 'express';
import AuthRouter from './AuthRoutes';

export default class RouteManager {
  static setupRoutes(app: Application) {
    app.use('/auth', AuthRouter);
  }
}
