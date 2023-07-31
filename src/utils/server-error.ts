import { Server } from 'http';
import { AppLogger } from '.';

export default (server: Server) => {
  process.on('uncaughtException', (err: Error) => {
    AppLogger.error(err);
    AppLogger.info('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('unhandledRejection', (err: Error) => {
    AppLogger.error(err);
    AppLogger.info('UNHANDLED REJECTION! 💥 Shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    AppLogger.info('👋 SIGTERM RECEIVED. Shutting down gracefully!');
    server.close(() => {
      process.exit(1);
    });
  });
};
