import { gql } from 'apollo-server-express';
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
    userId: String!
    createdAt: String!
    updatedAt: String!
    firstName: String!
    lastName: String!
    streetAddress: String!
    postalCode: String!
    email: String!
    phoneNumber: String!
    products: [OrderProduct]!
  }

  input InputOrder {
    firstName: String!
    lastName: String!
    streetAddress: String!
    postalCode: String!
    email: String!
    phoneNumber: String!
    products: [InputOrderProduct]!
  }

  input InputOrderProduct {
    productId: Int!
    quantity: Int!
  }  

  type Query {
    products: [Product]
    product(id: Int!): Product
    orders: [Order]
    order(id: Int!): Order
  }

  type Mutation {
    createOrder(inputOrder: InputOrder!): Order
  }
`;

export default typeDefs;