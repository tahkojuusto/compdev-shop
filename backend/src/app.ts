import express from 'express';
import { createConnection } from 'typeorm';
import { ProductRouter } from './routers';
import { dbConfig, logger } from './utils';

async function initDbConnection() {
  await createConnection(dbConfig);
}

function initExpressApp() {
  const app = express();
  
  const productRouter = new ProductRouter();
  app.use('/products', productRouter.getRouter());
  
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    logger.info(`Compdev shop backend running at port ${port}.`);
  });
}

(async () => {
  logger.verbose('Starting compdev shop backend.');
  await initDbConnection();
  logger.verbose('Created db connection.');
  initExpressApp();
})();
