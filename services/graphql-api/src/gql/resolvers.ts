import { IResolvers, AuthenticationError } from 'apollo-server-express';

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
    orders: async (_source, _args, { dataSources, user }) => {
      if (!user) {
        throw new AuthenticationError('No user id was found.');
      }
      return dataSources.orderApi.getOrders();
    },
    order: async (_source, { id }, { dataSources, user }) => {
      if (!user) {
        throw new AuthenticationError('No user id was found.');
      }
      return dataSources.orderApi.getOrderById(id);
    },
  },
  Mutation: {
    createOrder: async (_source, { inputOrder }, { dataSources, user }) => {
      if (!user) {
        throw new AuthenticationError('No user id was found.');
      }
      return dataSources.orderApi.createOrder({...inputOrder});
    },
  },
  OrderProduct: {
    description: async (orderProduct, _args, { dataSources }) => {
      const product = await dataSources.productApi.getProductById(
        orderProduct.productId
      );
      return product.description;
    },
    unit: async (orderProduct, _args, { dataSources }) => {
      const product = await dataSources.productApi.getProductById(
        orderProduct.productId
      );
      return product.unit;
    },
  },
};

export default resolvers;
