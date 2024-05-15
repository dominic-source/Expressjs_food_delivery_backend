import { userMutationResolvers, userQueryResolvers } from './user&category.resolver';
import { productQueryResolver, productMutationResolver } from './products.resolver';
import { ordersMutationResolver, ordersQueryResolver } from './orders.resolver';

const resolvers = {
  Query: {
    ...userQueryResolvers,
    ...productQueryResolver,
    ...ordersQueryResolver,
  },

  Mutation: {
    ...userMutationResolvers,
    ...productMutationResolver,
    ...ordersMutationResolver,
  },
};
module.exports = resolvers;
