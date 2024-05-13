import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`#graphql

  type Message {
    message: String!,
    token: String
  }

  type Location {
    id: ID
    name: String
    longitude: String
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
    products: [String]!
  }

  type Category {
    id: ID!
    name: String!
    products: [Product]
  }

  type Product {
    id: ID!
    name: String!
    description: String!
    price: Int!
    createdAt: String!
    updatedAt: String!
    currency: String!
    photo: String
    categoryId: String
  }

  input updateProduct {
    name: String
    description: String
    price: Int
    currency: String,
    photo: String
  }

  type Query {
    users: [User]!
    user: User
    category(id: ID!): Category
    categories: [Category]!
    getProduct(id: ID!): Product
    getUserProducts: [Product]!
    getAllProducts: [Product]!
    getAllProductsOfUsersByCategory(categoryId: ID!): [Product]!
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
      categoryId: String!): Product

    deleteProduct(id: ID!): Message!
    updateProduct(id: ID!, product: updateProduct, categoryId: ID!): Product 
  }
`);

export default typeDefs;
