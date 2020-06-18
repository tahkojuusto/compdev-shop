module.exports = [
  {
    name: 'root',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    cli: {
      migrationsDir: 'src/migrations',
    }    
  },  
  {
    name: 'seed',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/seeds/**/*.ts'],
    subscribers: ['src/subscribers/**/*.ts'],
    cli: {
      migrationsDir: 'src/seeds',
    }    
  }
];
