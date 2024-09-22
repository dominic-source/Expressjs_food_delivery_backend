import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`#graphql

input OrderItem2 {
  id: ID!
  quantity: Int
  comments: String
  ratings: Int
}

input OrderItems {
  productId: ID!
  quantity: Int
  comments: String
  ratings: Int
}

input updateProduct {
  name: String
  description: String
  price: Int
  currency: String,
  photo: String
}

type Category {
  id: ID!
  name: String!
  products: [Product]
}

type Location {
  id: ID
  name: String
  longitude: String
  latitude: String
}

type Message {
  message: String
  token: String
  id: ID
  userData: User
  usersData: [Users]
  foodsData: [Restaurant]
  orderData: Order
  ordersData: [Order]
  productData: Product
  productsData: [Product]
  orderItemsData: [OrderItem]
  orderItemData: OrderItem
  paymentsData: [Payment]
  paymentData: Payment
  categoryData: Category
  categoriesData: [Category]
  locationData: Location
  statusCode: Int!
  ok: Boolean!
}

type Mutation {
  createCategory(name: String!): Message!
  createCategories(name: [String!]!): Message!
  createOrder(
    sellerId: ID!
    dispatcherId: ID
    deliveryAddress: String!
    orderItems: [OrderItems]!
  ): Message!
  createPayment(
    orderId: ID!
    paymentMethod: String!
    currency: String!
    sellerAmount: Int!
    dispatcherAmount: Int!
  ): Message!
  createProduct(
    name: String!,
    description: String!,
    price: Int!,
    currency: String!,
    categoryId: ID!): Message!
  createUser(
    firstName: String!
    lastName: String!
    username: String!
    email: String!
    passwordHash: String!
    phoneNumber: String!
    userType: String
    buyerStatus: String
    sellerStatus: String
    dispatcherStatus: String
    lgaId: String
    vehicleNumber: String
    businessDescription: String
  ): Message!
  deleteAnOrderItem(orderId: ID!, orderItemId: ID!): Message!
  deleteCategory(id: ID!): Message!
  deleteOrder(orderId: ID!): Message!
  deleteOrderItemsNow(ids: [ID]!): Message!
  deleteProduct(id: ID!): Message!
  deleteUser: Message!
  forgotPassword(email: String!): Message!
  login(email: String!, password: String!): Message!
  logout: Message!
  updateOrder(orderId: ID!, status: String!): Message!
  updateOrderAddress(orderId: ID!, deliveryAddress: String!): Message!
  updateOrderItems(orderId: ID!, orderItems: [OrderItem2]!): Message!
  updatePassword(email: String!, token: String!, password: String!): Message! 
  updatePayment(
    paymentId: ID!
    status: String!
  ): Message!
  updateProduct(
    orderId: ID!,
    deliveryAddress: String!,
    recievedByBuyer: Boolean,
    deliveredByDispatcher: Boolean): Message!
  updateUser(
    firstName: String
    lastName: String
    username: String
    email: String
    phoneNumber: String
    userType: String
    buyerStatus: String
    sellerStatus: String
    dispatcherStatus: String
    lgaId: String
    vehicleNumber: String
  ): Message!
}

type Order {
  id: ID!
  sellerId: ID!
  buyerId: ID!
  dispatcherId: ID
  orderDateTime: String!
  timeOfDelivery: String
  deliveryAddress: String!
  currency: String!
  totalAmount: Int!
  status: String!
  orderItems: [String]!
  payment: [Payment]
  paymentToken: String
}

type OrderItem {
  id: ID!
  productId: ID!
  quantity: Int
  comments: String
  ratings: Int
}

type Payment {
  id: ID!
  orderId: ID!
  paymentDateTime: String!
  paymentMethod: String
  currency: String!
  totalAmount: Int!
  paymentStatus: String!
}

type Payments {
  id: ID!
  paymentDateTime: String
  lastUpdateTime: String!
  paymentMethod: String!
  currency: String!
  sellerAmount: Int!
  dispatcherAmount: Int!
  sellerPaymentStatus: String!
  dispatcherPaymentStatus: String!
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

type Query {
  category(id: ID!): Message!
  categories: Message!
  findFoods(productName: String!): Message!
  findRestaurants(username: String): Message!
  getAllOrders: Message!
  getAllProducts: Message!
  getAllProductsOfUsersByCategory(categoryId: ID!): Message!
  getAnOrderItem(orderItemId: ID!): Message!
  getMyOrderItems(orderId: ID!): Message!
  getMyOrders: Message!
  getMyPayment(orderId: ID!): Message!
  getProduct(id: ID!): Message!
  getTheOrderAsDispatcher: Message!
  getTheOrderAsSeller: Message!
  getUserProducts: Message!
  user: Message!
  users: Message!
}

type Restaurant {
  id: ID!
  name: String!
  description: String
  price: Float
  currency: String
  userId: ID!
  username: String!
  businessDescription: String
  products: [String]!
  phoneNumber: String
  email: String!
  createdAt: String!
  photo: String
  addressSeller: [Location]
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
  buyerStatus: String
  sellerStatus: String
  dispatcherStatus: String
  photo: String
  addressSeller: [Location]
  addressBuyer: [Location]
  addressDispatcher: [Location]
  businessDescription: String
  products: [String]!
}

type Users {
  firstName: String!
  lastName: String!
  username: String!
  email: String!
}
`);

export default typeDefs;
