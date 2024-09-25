# DELIVER APP

A delivery application connecting buyers, sellers, and dispatchers.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Unittesting](#unittesting)
- [Code of Conduct](#code-of-conduct)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Deliver App is a delivery application that connects buyers, sellers, and dispatchers. It provides a platform for users to manage orders, products, payments, and more through a GraphQL API.

## Features

- User authentication and authorization
- Product management
- Order management
- Payment processing
- Rate limiting
- Logging
- GraphQL API with Apollo Server

## Technologies Used

- Node.js
- Express.js
- Apollo Server
- GraphQL
- MongoDB
- Mongoose
- dotenv
- bcrypt
- cors
- body-parser
- express-rate-limit
- graphql-shield
- graphql-rate-limit

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional, for containerized deployment)
- Redis server


### Installation

1. Clone the repository:
```sh
   git clone https://github.com/dominic-source/Express_food_delivery_backend.git
   cd Express_food_delivery_backend
```

2. Install dependencies using pnpm:
```bash
    pnpm install
```

3. Set permissions for database_mongo folder, this will preserve our database data
```bash
    chmod 777 -R ./database_mongo
```

4. Run docker compose to start mongodb
```bash
    docker compose up -d
```

5. Ensure that redis server is installed and start it

6. Open a new terminal and start consumer precess
```bash
    cd utils
    node consumer.js
```
### Installation
1. Start the application, ensure you are in the root folder of the project

```bash
    pnpm start
```

2. The server will start on the port specified in the environment variables (default is 5000).

### Environment Variables

```bash
DELIVER_MONGODB_HOST=localhost
DELIVER_MONGODB_DB=example_db
DELIVER_MONGODB_USER=example_user
DELIVER_MONGODB_PWD=example_pwd
DELIVER_MONGODB_PORT=port_number
DELIVER_MONGODB_URL="example uri"
DELIVER_URL=http://localhost:3000
SECRET_KEY=secret_key
FRONTEND_URL="http://localhost:3000"
```

### Project Structure

```plaintext
├── app.js
├── autocommit.py
├── CODE_OF_CONDUCT.md
├── compose.yaml
├── configPayment.json
├── controllers
│   └── userControllers.js
├── create_files.sh
├── database_mongo
├── graphqlSchema
│   └── typeDefs.js
├── LICENSE.md
├── logs
│   ├── error.log
│   └── request.log
├── middlewares
│   └── logMiddleware.js
├── migrate-mongo-config.js
├── migrations
│   └── 20240910161125-first-migration.js
├── models
│   ├── category.js
│   ├── location.js
│   ├── orderItem.js
│   ├── order.js
│   ├── payment.js
│   ├── product.js
│   └── user.js
├── mongodb.env
├── node_modules
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── README.md
├── resolver
│   ├── orders.resolver.js
│   ├── payment.resolver.js
│   ├── products.resolver.js
│   ├── resolvers.js
│   └── user&category.resolver.js
├── routes
│   └── index.js
├── setup_env.sh
├── static
│   └── uploads
│       └── 1714152413914-341049797-toUploadFile.png
├── test
│   ├── test_order_resolver
│   │   ├── createOrder.test.js
│   │   ├── deleteAnOrderItem.test.js
│   │   ├── deleteOrderItemsNow.test.js
│   │   ├── deleteOrder.test.js
│   │   ├── getAllOrders.test.js
│   │   ├── getMyOrderItems.test.js
│   │   ├── getMyOrders.test.js
│   │   ├── getTheOrderAsDispatcher.test.js
│   │   ├── getTheOrderAsSeller.test.js
│   │   ├── updateOrderAddress.test.js
│   │   └── updateOrderItems.test.js
│   ├── test_payment_resolver
│   │   ├── createPayment.test.js
│   │   ├── getMyPayment.test.js
│   │   └── updatePayment.test.js
│   ├── test_product_resolver
│   │   ├── createProduct.test.js
│   │   ├── deleteProduct.test.js
│   │   ├── getAllProductsOfUsersByCategor.test.js
│   │   ├── getAllProducts.test.js
│   │   ├── getProduct.test.js
│   │   ├── getUserProducts.test.js
│   │   └── updateProduct.test.js
│   └── test_user_resolver
│       ├── categories.test.js
│       ├── category.test.js
│       ├── createCategories.test.js
│       ├── createCategory.test.js
│       ├── createUser.test.js
│       ├── deleteCategory.test.js
│       ├── deleteUser.test.js
│       ├── forgotPassword.test.js
│       ├── logins.test.js
│       ├── logout.test.js
│       ├── updatePassword.test.js
│       ├── updateUser.test.js
│       ├── users.test.js
│       └── user.test.js
└── utils
    ├── allowedextension.js
    ├── consumer.js
    ├── emailclient.js
    ├── managedata
    │   ├── deletemodels.js
    │   └── sendrequest.js
    ├── mutation.js
    └── mylogger.js
```


## API Endpoints

### GraphQL Endpoints

- `/graphql`: Main GraphQL endpoint for querying and mutating data.

### REST Endpoints

- `/api`: RESTful API routes for additional functionalities.

## Unittesting

```bash
    npm test
```

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the expected behavior in our community.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
