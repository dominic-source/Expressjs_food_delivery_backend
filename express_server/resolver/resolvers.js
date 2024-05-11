import { userMutationResolvers, userQueryResolvers } from './user&category.resolver';
import { productQueryResolver, productMutationResolver } from './products.resolver';

const resolvers = {
  Query: {
    ...userQueryResolvers,
    ...productQueryResolver,
  },

  Mutation: {
    ...userMutationResolvers,
    ...productMutationResolver,
  },
};
module.exports = resolvers;
