import * as dotenv from 'dotenv';

dotenv.config();

const environmentVariables: string[] = [];

for (const variable of environmentVariables) {
  if (!(variable in process.env)) {
    throw new Error(`Environment variable ${variable} not set!`);
  }
}

const config = {
  utils: {
    logLevel: process.env.LOG_LEVEL || 'info',
    serviceName: process.env.SERVICE_NAME || '',
  },
};

export { config };
