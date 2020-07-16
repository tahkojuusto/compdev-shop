import { readFileSync } from 'fs';
import {
  createTestClient,
  ApolloServerTestClient,
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../src/gql/schema';
import { ProductAPI, OrderAPI } from '../src/gql/apis';
import resolvers from '../src/gql/resolvers';

import PRODUCTS from './resources/api/products.json';
import ORDERS from './resources/api/orders.json';
import CREATE_ORDER from './resources/api/createOrder.json';

const GET_PRODUCTS_QUERY = readFileSync(
  './test/resources/queries/getProducts.gql'
).toString();
const GET_PRODUCT_BY_ID_QUERY = readFileSync(
  './test/resources/queries/getProductById.gql'
).toString();
const GET_ORDERS_QUERY = readFileSync(
  './test/resources/queries/getOrders.gql'
).toString();
const GET_ORDER_BY_ID_QUERY = readFileSync(
  './test/resources/queries/getOrderById.gql'
).toString();
const CREATE_ORDER_QUERY = readFileSync(
  './test/resources/queries/createOrder.gql'
).toString();

describe('GraphQL queries', () => {
  let testClient: ApolloServerTestClient;

  beforeAll(() => {
    const productApi = new ProductAPI('');
    const orderApi = new OrderAPI('');

    productApi.getProducts = jest.fn().mockResolvedValue(PRODUCTS);
    productApi.getProductById = jest.fn().mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(PRODUCTS[0]);
      if (id === 2) return Promise.resolve(PRODUCTS[1]);
      return null;
    });
    orderApi.getOrders = jest.fn().mockResolvedValue(ORDERS);
    orderApi.getOrderById = jest.fn().mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(ORDERS[0]);
      if (id === 2) return Promise.resolve(ORDERS[1]);
      return null;
    });

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        productApi,
        orderApi,
      }),
      context: ({ req }) => {
        return { user: 'testuser' };
      },
    });

    testClient = createTestClient(server);
  });

  it('should return products', async () => {
    expect.assertions(1);
    const res = await testClient.query({ query: GET_PRODUCTS_QUERY });
    expect(res).toMatchSnapshot();
  });

  it('should return product by id', async () => {
    expect.assertions(1);
    const res = await testClient.query({
      query: GET_PRODUCT_BY_ID_QUERY,
      variables: { id: 1 },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find nonexistent product', async () => {
    expect.assertions(1);
    const res = await testClient.query({
      query: GET_PRODUCT_BY_ID_QUERY,
      variables: { id: 5 },
    });
    expect(res.data?.product).toBeNull();
  });

  it('should return orders', async () => {
    expect.assertions(1);
    const res = await testClient.query({ query: GET_ORDERS_QUERY });
    expect(res).toMatchSnapshot();
  });

  it('should return order by id', async () => {
    expect.assertions(1);
    const res = await testClient.query({
      query: GET_ORDER_BY_ID_QUERY,
      variables: { id: 1 },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not find nonexistent order', async () => {
    expect.assertions(1);
    const res = await testClient.query({
      query: GET_ORDER_BY_ID_QUERY,
      variables: { id: 5 },
    });

    expect(res.data?.order).toBeNull();
  });
});

describe('GraphQL mutations', () => {
  let testClient: ApolloServerTestClient;

  beforeAll(() => {
    const productApi = new ProductAPI('');
    const orderApi = new OrderAPI('');

    productApi.getProductById = jest.fn().mockImplementation((id: number) => {
      if (id === 1) return Promise.resolve(PRODUCTS[0]);
      if (id === 2) return Promise.resolve(PRODUCTS[1]);
      return null;
    });
    orderApi.createOrder = jest.fn().mockResolvedValue(ORDERS[0]);

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        productApi,
        orderApi,
      }),
      context: ({ req }) => {
        return { user: 'testuser' };
      },
    });

    testClient = createTestClient(server);
  });

  it('should create order', async () => {
    expect.assertions(1);
    const res = await testClient.mutate({
      mutation: CREATE_ORDER_QUERY,
      variables: { inputOrder: CREATE_ORDER },
    });
    expect(res).toMatchSnapshot();
  });

  it('should not create invalid order', async () => {
    expect.assertions(1);
    const res = await testClient.mutate({
      mutation: CREATE_ORDER_QUERY,
      variables: { inputOrder: { x: 2 } },
    });
    expect(res.errors?.length).toBeGreaterThan(0);
  });
});
