import Container from 'typedi';
import AdminSeeder from './admin';
import { Seeder } from '../interfaces';

const seeders: Seeder[] = [Container.get<AdminSeeder>(AdminSeeder)];

export const bootstrapSeeder = async () => {
  await Promise.all(seeders.map(seeder => seeder.seed()));
};
