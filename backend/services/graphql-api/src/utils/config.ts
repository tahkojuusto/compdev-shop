import * as dotenv from 'dotenv';

dotenv.config();

const environmentVariables: string[] = [
  'PRODUCT_CATALOG_API_URL',
  'PRODUCT_CATALOG_API_PORT',
  'ORDER_API_URL',
  'ORDER_API_PORT',
  'AUTH0_ISSUER',
  'AUTH0_AUDIENCE',
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
    order: {
      url: process.env.ORDER_API_URL,
      port: '8080',
    },
  },
  auth: {
    issuer: process.env.AUTH0_ISSUER,
    audience: process.env.AUTH0_AUDIENCE,
  },
  utils: {
    logLevel: process.env.LOG_LEVEL || 'info',
    serviceName: process.env.SERVICE_NAME || '',
  },
};

export { config };
