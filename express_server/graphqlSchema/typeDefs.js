import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`#graphql

  type Location {
    name: String,
    longitude: String,
    latitude: String
  }

  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    passwordHash: String!
    phoneNumber: String,
    lgaId: String,
    vehicleNumber: String,
    userType: String,
    status: String
    photo: String,
    address_seller: [Location],
    address_buyer: [Location],
    address_dispatcher: [Location]
  }

  type Query {
    users: [User]!
    user(username: String!): User
  }

  type Mutation {
    createUser(
      username: String!,
      email: String!,
      phoneNumber: String!,
      userType: String!
      status: String!
      lgaId: String
    ): User!
    updateUser(id: ID!, username: String, email: String): User
    deleteUser(id: ID!): String!
  }
`);

export default typeDefs;
