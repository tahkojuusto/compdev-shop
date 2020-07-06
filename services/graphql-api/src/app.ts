import { logger, config } from './utils';
import { ApolloServer, IResolvers } from 'apollo-server';

import typeDefs from './gql/schema';
import { ProductAPI, OrderAPI } from './gql/apis';
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest';

function initGraphQLApp() {
  const productApiUrl: string = `${config.api.productCatalog.url}:${config.api.productCatalog.port}`;
  const orderApiUrl: string = `${config.api.order.url}:${config.api.order.port}`;

  const productApi = new ProductAPI(productApiUrl);
  const orderApi = new OrderAPI(orderApiUrl);

  const resolvers: IResolvers = {
    Unit: {
      KG: 'kg',
      PCS: 'pcs',
      L: 'l',
    },
    Query: {
      products: async (_source, _args, { dataSources }) => {
        return dataSources.productApi.getProducts();
      },
      product: async (_source, { id }, { dataSources }) => {
        return dataSources.productApi.getProductById(id);
      },
      orders: async (_source, _args, { dataSources }) => {
        return dataSources.orderApi.getOrders();
      },
      order: async (_source, { id }, { dataSources }) => {
        return dataSources.orderApi.getOrderById(id);
      },
    },
    OrderProduct: {
      description: async (orderProduct, _args, { dataSources }) => {
        const product = await dataSources.productApi.getProductById(orderProduct.productId);
        return product.description;
      },
      unit: async (orderProduct, _args, { dataSources }) => {
        const product = await dataSources.productApi.getProductById(orderProduct.productId);
        return product.unit;
      },      
    }
  };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      productApi,
      orderApi,
    }),
  });

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
