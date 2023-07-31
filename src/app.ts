import express from 'express';
import DatabaseService from './services/DatabaseService';
import { AppLogger, errorHandlerMiddleware } from './utils';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import RouteManager from './routes';

// Connect to DB
DatabaseService.connect()
  .then(result => {
    AppLogger.info('Mongo Connected', result);
  })
  .catch(error => {
    AppLogger.error(error.message, error);
  });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors());

/** Routes go here */
RouteManager.setupRoutes(app);

app.use(errorHandlerMiddleware);

export default app;
