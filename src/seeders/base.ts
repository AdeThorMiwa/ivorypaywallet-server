import { DataSource } from 'typeorm';
import DatabaseService from '../services/DatabaseService';

abstract class BaseSeeder {
  protected getDBInstance = (): Promise<DataSource> => {
    const instance = DatabaseService.getInstance();
    if (instance.isInitialized) {
      return Promise.resolve(instance);
    } else {
      return new Promise((res, rej) => {
        setTimeout(() => {
          if (instance.isInitialized) {
            res(instance);
          } else {
            rej('Could not initialize db instance');
          }
        }, 5000);
      });
    }
  };
}

export default BaseSeeder;
