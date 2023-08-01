import { DataSource } from 'typeorm';
import config from 'config';
import { AppLogger } from '../utils';
import { User, Wallet } from '../entities';

class DatabaseService {
  private static DB = new DataSource({
    type: config.get<'postgres'>('database.type'),
    host: config.get('database.host'),
    port: config.get<number>('database.port'),
    username: config.get<string>('database.username'),
    password: process.env.DATABASE_PASSWORD,
    database: config.get<string>('database.database'),
    ssl: true,
    synchronize: true,
    logging: config.util.getEnv('NODE_ENV') !== 'production',
    entities: [User, Wallet],
  });

  static async connect() {
    this.DB.initialize()
      .then(() => {
        AppLogger.info('Data Source has been initialized!');
      })
      .catch(err => {
        AppLogger.error('Error during Data Source initialization', err);
      });
  }

  static getInstance() {
    return this.DB;
  }
}

export default DatabaseService;
