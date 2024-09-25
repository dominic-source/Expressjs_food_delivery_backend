import { userMutationResolvers, userQueryResolvers } from './user&category.resolver';
import { productQueryResolver, productMutationResolver } from './products.resolver';
import { ordersMutationResolver, ordersQueryResolver } from './orders.resolver';
import { paymentMutationResolver, paymentQueryResolver } from './payment.resolver';

const resolvers = {
  Query: {
    ...userQueryResolvers,
    ...productQueryResolver,
    ...ordersQueryResolver,
    ...paymentQueryResolver,
  },

  Mutation: {
    ...userMutationResolvers,
    ...productMutationResolver,
    ...ordersMutationResolver,
    ...paymentMutationResolver,
  },
};
module.exports = resolvers;
