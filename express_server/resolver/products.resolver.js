import { myLogger } from '../utils/mylogger';
import { Product } from '../models/product';

export const productQueryResolver = {
  getProduct: async (_parent, { name }, { user }) => {
    try {
      return await Product.find({ name });
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  }
}

export const productMutationResolver = {
  createProduct: async (_parent, args, { user }) => {
      try {
        const { name, description, price, currency, userId } = args;
        const product = new Product({ name, description, price, currency, userId });
        return await product.save();
      } catch (error) {
        myLogger.error('Error creating user: ' + error.message);
        return null;
      }    
  },
}
