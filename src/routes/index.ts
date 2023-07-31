import { Application } from 'express';
import { AppLogger } from '../utils';

export default class RouteManager {
  static setupRoutes(app: Application) {
    AppLogger.info(app.enabled); // dummy log
  }
}
