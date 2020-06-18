import { config } from './';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: config.db.host,
  port: parseInt(config.db.port || '3306'),
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
};

export { dbConfig };
