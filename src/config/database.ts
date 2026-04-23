import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './index';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [__dirname + '/../entity/entities/*.js'],
  synchronize: config.database.synchronize,
  logging: config.database.logging,
});