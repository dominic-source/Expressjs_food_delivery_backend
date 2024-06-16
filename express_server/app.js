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
import { rateLimit } from 'express-rate-limit'
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';
import { shield } from 'graphql-shield';
import { createRateLimitRule } from 'graphql-rate-limit';

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
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
}

// create rate limit rule
const rateLimitRule = createRateLimitRule({
  identifyContext: (context) => context.req.headers['x-forwarded-for'] || context.req.connection.remoteAddress || context.req.ip,
  max: 100,
  window: '15m'
});

// create permissions for some resolvers
const permissions = shield({
  Mutation: {
    createUser: rateLimitRule,
    updateUser: rateLimitRule,
    deleteUser: rateLimitRule,
  },
});

// Create executable schema with permissions middleware
const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  permissions
);

// Parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logs all incoming requests
app.use(logMiddleware);

// Apply CORS middleware
app.use(cors(corsOptions));

// Create an instance of express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests from this IP, please try again after 15 minutes"
})
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use('/api', router)

// Start Apollo server
const server = new ApolloServer({
  schema,
  csrfPrevention: true,
  cache: 'bounded',
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
