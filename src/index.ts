import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { AppLogger, unhandledErrorHandler } from './utils';
import config from 'config';
import app from './app';

const host = config.get<string>('server.host');
const port = process.env.PORT ? parseInt(process.env.PORT) : config.get<number>('server.port');

const server = app.listen(port, host, () =>
  AppLogger.info(`⚡️[server]: Server is running on HOST >> ${host} and PORT >> ${port}`),
);
unhandledErrorHandler(server);
