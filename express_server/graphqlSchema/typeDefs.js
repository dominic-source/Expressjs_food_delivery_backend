import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`#graphql

  type Location {
    name: String,
    longitude: String,
    latitude: String
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    createdAt: String!
    updatedAt: String!
    phoneNumber: String
    lgaId: String
    vehicleNumber: String
    userType: String
    status: String
    photo: String
    address_seller: [Location]
    address_buyer: [Location]
    address_dispatcher: [Location]
  }

  type Query {
    users: [User]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(
      firstName: String!
      lastName: String!
      username: String!
      email: String!
      passwordHash: String!
      phoneNumber: String!
      userType: String
      status: String
      lgaId: String
      vehicleNumber: String
    ): User!
    updateUser(id: ID!, username: String, email: String): User
    deleteUser(id: ID!): String!
  }
`);

export default typeDefs;
