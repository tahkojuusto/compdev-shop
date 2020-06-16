import * as dotenv from 'dotenv';

dotenv.config();

const environmentVariables: string[] = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];

for (const variable of environmentVariables) {
  if (!(variable in process.env)) {
    throw new Error(`Environment variable ${variable} not set!`);
  }
}

const config = {
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  utils: {
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};

export { config };
