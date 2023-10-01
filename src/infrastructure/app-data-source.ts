import { join } from 'path';

import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const entitiesPath = join(__dirname, '../domain/entity/*.{ts,js}');
const migrationsPath = join(__dirname, '../infrastructure/migration/*.{ts,js}');

export const appDataSource: DataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT, 10),
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  synchronize: true,
  logging: false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  namingStrategy: new SnakeNamingStrategy(),
});
