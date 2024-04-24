import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './graphqlSchema/typeDefs';
import resolvers from './resolvers/userResolves';
import multer from 'multer';

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
    allowedExtensions.includes(mimetype.toLowerCase())) {
    return true;
  }
  return false;
}

// Setup storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/uploads')
  },
  filename: function (req, file, cb) {
    if (allowedExtensions(file.fieldname, file.mimetype)) {
      const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniquePrefix + '-' + file.fieldname);
    } else cb(null, file.fieldname+uniquePrefix);
  }
});

export const upload = multer({ storage: storage })

// Setup mongodb server
// const uri = `mongodb://${DELIVER_MONGODB_USER}:${DELIVER_MONGODB_PWD}@${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}`;
// const uri = `mongodb://${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}`;
const uri = `mongodb://${DELIVER_MONGODB_USER}:${DELIVER_MONGODB_PWD}@${DELIVER_MONGODB_HOST}:${DELIVER_MONGODB_PORT}/${DELIVER_MONGODB_DB}?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.2.2`
mongoose.connect(uri)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Configure CORS
// app.use(cors());

// Parse incoming request bodies
app.use(bodyParser.json());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false, // Disable Apollo Server's built-in file uploads handling
  context: ({ req, res }) => ({ req, res }),
});

server.start()
  .then(() => {
    // apply middleware for fileuploads using express from graphql
    app.use('/graphql', expressMiddleware(server));
  })
  .catch(error => {
    console.error('Error starting Apollo Server:', error);
  });


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})