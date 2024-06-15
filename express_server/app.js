import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './graphqlSchema/typeDefs';
import resolvers from './resolver/resolvers';
import router from './routes';
import { logMiddleware } from './middlewares/logMiddleware';
import process from 'process';

// initialize express server
const app = express();

// initialize configuration for environmental variables
dotenv.config();

// get environment variable
const { DELIVER_MONGODB_DB,
  DELIVER_MONGODB_USER,
  DELIVER_MONGODB_PWD,
  DELIVER_MONGODB_HOST,
  DELIVER_MONGODB_PORT
} = process.env;

// Setup mongodb server
const uri = `mongodb://${DELIVER_MONGODB_USER}:${DELIVER_MONGODB_PWD}@${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.2.2`
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Configure CORS
const corsOptions = {
  origin: 'https://studio.apollographql.com',
  optionsSuccessStatus: 200,
  methods: ['GET', 'PUT', 'POST'],
}

app.use('/api', logMiddleware);
app.use(cors(corsOptions));

// Parse incoming request bodies
app.use(bodyParser.json());
app.use('/api', router)

// Start Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


server.start()
  .then(() => {
    // apply middleware for graphql endpoint
    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req, res }) =>  { req, res }
    }));
    console.log('Graphql server has started!')
  })
  .catch(error => {
    console.error('Error starting Apollo Server:', error);
  });


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
