import * as dotenv from 'dotenv';

dotenv.config();

const environmentVariables: string[] = [
  'PRODUCT_CATALOG_API_URL',
  'PRODUCT_CATALOG_API_PORT',
];

for (const variable of environmentVariables) {
  if (!(variable in process.env)) {
    throw new Error(`Environment variable ${variable} not set!`);
  }
}

const config = {
  api: {
    productCatalog: {
      url: process.env.PRODUCT_CATALOG_API_URL,
      port: '8080',
    },
  },
  utils: {
    logLevel: process.env.LOG_LEVEL || 'info',
    serviceName: process.env.SERVICE_NAME || '',
  },
};

export { config };
