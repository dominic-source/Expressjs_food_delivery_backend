import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(username: String!, email: String!): User!
    updateUser(id: ID!, username: String, email: String): User
    deleteUser(id: ID!): String!
  }
`);

export default typeDefs;
