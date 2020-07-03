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
    price: Float
  }

  type Query {
    Products: [Product]
    Product(id: Int!): Product
  }
`;

export default typeDefs;