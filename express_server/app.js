import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './graphqlSchema/typeDefs';
import resolvers from './resolvers/userResolves';
import router from './routes';
import { User } from './models/user';
import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';

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

// check file extension is allowed
export function allowedExtensions(filename, mimetype) {
  const allowed_extentions = ['png', 'jpg', 'jpeg', 'gif', 'image/png', 'image/jpeg', 'image/gif'];
  const name = filename.split('.');
  if (allowed_extentions.includes(name[name.length-1].toLowerCase()) ||
    allowed_extentions.includes(mimetype.toLowerCase())) {
    return true;
  }
  return false;
}
// Setup mongodb server
// const uri = `mongodb://${DELIVER_MONGODB_USER}:${DELIVER_MONGODB_PWD}@${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}`;
// const uri = `mongodb://${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}`;
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
      context: async ({ req, res }) => {

        const publicResolvers = ['createUser', 'Login', 'forgotPassword', 'updatePassword', '']; 

        // Determine the resolver being called
        const resolverName = req.body.operationName;
        // If it's a public resolver, return an empty context
        if (publicResolvers.includes(resolverName)) {
          return { req, res };
        }

        // Check the authorization header of the user
        const reqHeader = req.headers.authorization;
        if (!reqHeader || !reqHeader.startsWith('Bearer ')) throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });

        // Verify the token if it is authentic
        const token = reqHeader.split(' ')[1] || '';
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });

        // if decoded find the user and check if the user is logged In and not deleted
        const user = await User.findById(decoded.userId);
        if (!user || !user.isLoggedIn || user.isDeleted) throw new GraphQLError('User is not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });
        return { req, res, user, roles: ["user"] }
      }
      ,
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
