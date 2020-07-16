import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { OrderRouter } from './routers';
import { dbConfig, logger } from './utils';

async function initDbConnection() {
  await createConnection(dbConfig);
}

function initExpressApp() {
  const app = express();

  // Middlewares
  app.use(bodyParser.json());

  // Routers
  const orderRouter = new OrderRouter();
  app.use('/orders', orderRouter.getRouter());

  return app;
}

export { initExpressApp, initDbConnection };
