import { logger } from "./utils";
import express from 'express';
import { initDbConnection, initExpressApp } from "./app";

(async () => {
  logger.verbose('Starting products microservice.');
  await initDbConnection();
  logger.verbose('Created db connection');
  const app: express.Express = initExpressApp();

  // Start app
  const port = process.env.NODE_PORT || 8080;
  app.listen(port, () => {
    logger.info(`Products microservice running at port ${port}.`);
  });
})();