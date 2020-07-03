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
  
  // Start app
  const port = process.env.NODE_PORT || 8080;
  app.listen(port, () => {
    logger.info(`Orders microservice running at port ${port}.`);
  });
}

(async () => {
  logger.verbose('Starting orders microservice backend.');
  await initDbConnection();
  logger.verbose('Created db connection.');
  initExpressApp();
})();
