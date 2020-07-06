import { gql } from 'apollo-server';
import { DocumentNode } from 'graphql';

const typeDefs: DocumentNode = gql`
  enum Unit {
    KG
    PCS
    L
  }

  type Product {
    id: Int!
    name: String!
    description: String
    unit: Unit!
  }

  type OrderProduct {
    productId: Int!
    name: String
    description: String
    unit: Unit!
    price: Float!
    quantity: Int!
  }

  type Order {
    id: Int!
    firstName: String!
    lastName: String!
    streetAddress: String!
    postalCode: String!
    email: String!
    phoneNumber: String!
    products: [OrderProduct]!
  }

  type Query {
    products: [Product]
    product(id: Int!): Product
    orders: [Order]
    order(id: Int!): Order
  }
`;

export default typeDefs;