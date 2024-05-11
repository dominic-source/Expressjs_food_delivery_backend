import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`#graphql

  type Message {
    message: String!,
    token: String
  }

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
    isLoggedIn: Boolean
    isDeleted: Boolean
    userType: String
    status: String
    photo: String
    address_seller: [Location]
    address_buyer: [Location]
    address_dispatcher: [Location]
  }

  type Category {
    id: ID!
    name: String!
  }

  type Product {
    name: String!
    description: String!
    price: Int!
    createdAt: String!
    updatedAt: String!
    currency: String!
    photo: String
    userId: String!
  }

  type Query {
    users: [User]!
    user: User
    category(id: ID!): Category
    categories: [Category]!
    getProduct(name: String!): Product
    getUserProducts: [Product]!
    getAllProducts: [Product]!
    getAllProductsByCategory(categoryName: String!): [Product]!
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

    updateUser(
      firstName: String
      lastName: String
      username: String
      email: String
      phoneNumber: String
      userType: String
      status: String
      lgaId: String
      vehicleNumber: String
    ): Message!

    deleteUser: Message!
    login(email: String!, password: String!): Message!
    logout: Message!
    forgotPassword(email: String!): Message!
    updatePassword(email: String!, token: String!, password: String!): Message! 
    createCategory(name: String!): Category
    createCategories(name: [String!]!): Message!
    deleteCategory(id: ID!): Message!
    
    createProduct(
      name: String!,
      description: String!,
      price: Int!,
      currency: String!,
      category: String!,
      userId: String!): Product

    deleteProduct(name: String!): Message!
    updateProduct(id: ID!, name: String, price: String!, description: String!): Message! 
  }
`);

export default typeDefs;
