import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from './index';
import path from 'path';

const entitiesDir = config.isProduction
  ? path.join(__dirname, '../entity/entities/*.js')
  : path.join(__dirname, '../entity/entities/*.ts');

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [entitiesDir],
  synchronize: config.database.synchronize,
  logging: config.database.logging,
});