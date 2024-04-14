import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/index';

import typeDefs from './graphqlSchema/typeDefs';
import resolvers from './resolvers/userResolves';

const app = express();

// Configure CORS
app.use(cors());

// Parse incoming request bodies
app.use(bodyParser.json());

// 
app.use('/api/', router);

app.use('/graphql', graphqlHTTP({
  schema: typeDefs,
  rootValue: resolvers,
  graphiql: true, // Enables GraphiQL IDE for development
}));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})