import { logger, config } from './utils';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import expressJwt from 'express-jwt';

import { checkJwt } from './auth';
import typeDefs from './gql/schema';
import { ProductAPI, OrderAPI } from './gql/apis';
import resolvers from './gql/resolvers';

function initGraphQLApp() {
  const app: express.Express = express();

  app.use(checkJwt);

  const productApiUrl: string = `${config.api.productCatalog.url}:${config.api.productCatalog.port}`;
  const orderApiUrl: string = `${config.api.order.url}:${config.api.order.port}`;

  const productApi = new ProductAPI(productApiUrl);
  const orderApi = new OrderAPI(orderApiUrl);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      productApi,
      orderApi,
    }),
    context: ({ req }) => {
      return { user: req.user || null };
    },
  });

  server.applyMiddleware({ app });

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
