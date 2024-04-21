import express from 'express';
// import { graphqlHTTP } from 'express-graphql';
import { ApolloServer } from 'apollo-server-express';
// import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import router from './routes/index';
import typeDefs from './graphqlSchema/typeDefs';
import resolvers from './resolvers/userResolves';

// initialize express server
const app = express();

// initialize configuration
dotenv.config();

// get environment variable
const { DELIVER_MONGODB_DB,
  DELIVER_MONGODB_USER,
  DELIVER_MONGODB_PWD,
  DELIVER_MONGODB_HOST,
  DELIVER_MONGODB_PORT
} = process.env;

// Setup mongodb server
// const uri = `mongodb://${DELIVER_MONGODB_USER}:${DELIVER_MONGODB_PWD}@${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}`;
// const uri = `mongodb://${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}`;
const uri = `mongodb://${DELIVER_MONGODB_USER}:${DELIVER_MONGODB_PWD}@${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.2.2`
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Configure CORS
app.use(cors());

// // Parse incoming request bodies
app.use(bodyParser.json());
// app.use('/', router);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.start()
  .then(() => {
    server.applyMiddleware({ app });
  })
  .catch(error => {
    console.error('Error starting Apollo Server:', error);
  });

// app.use('/graphql', graphqlHTTP({
//   schema: typeDefs,
//   rootValue: resolvers,
//   graphiql: true, // Enables GraphiQL IDE for development
// }));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})