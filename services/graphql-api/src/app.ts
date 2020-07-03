import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { logger } from './utils';


function initGraphQLApp() {
  const app = express();

  // Middlewares
  app.use(bodyParser.json());

  // Start app
  const port = process.env.NODE_PORT || 8080;
  app.listen(port, () => {
    logger.info(`GraphQL API running at port ${port}.`);
  });
}

(async () => {
  logger.verbose('Starting GraphQL API.');
  initGraphQLApp();
})();
