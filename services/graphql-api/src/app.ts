import express from 'express';
import { logger } from './utils';
import { ApolloServer } from 'apollo-server';

import typeDefs from './schema';
import resolvers from './resolvers';

function initGraphQLApp() {
  const server = new ApolloServer({ typeDefs, resolvers });

  // Start app
  const port = process.env.NODE_PORT || 8080;
  server.listen(port, () => {
    logger.info(`GraphQL API running at port ${port}.`);
  });
}

(async () => {
  logger.verbose('Starting GraphQL API.');
  initGraphQLApp();
})();
