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

  // Start app
  const port = process.env.NODE_PORT || 8080;
  app.listen(port, () => {
    logger.info(`Products microservice running at port ${port}.`);
  });
}

(async () => {
  logger.verbose('Starting products microservice.');
  await initDbConnection();
  logger.verbose('Created db connection');
  initExpressApp();
})();
