import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { ProductRouter } from './routers';
import { dbConfig, logger } from './utils';

async function initDbConnection() {
  await createConnection(dbConfig);
}

function initExpressApp() {
  const app = express();

  // Middlewares
  app.use(bodyParser.json());

  // Routers
  const productRouter = new ProductRouter();
  app.use('/products', productRouter.getRouter());

  return app;
}

export { initExpressApp, initDbConnection };