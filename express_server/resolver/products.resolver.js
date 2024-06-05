import { myLogger } from '../utils/mylogger';
import { Product } from '../models/product';
import Category from '../models/category';
import { User } from '../models/user';


export const productQueryResolver = {
  getProduct: async (_parent, { id }) => {
    try {
      return await Product.findById(id);
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  },

  getUserProducts: async (_parent, _, { user }) => {
    try {
      const userMe = await User.findById(user.id).populate('products');
      return userMe.products;
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  },

  getAllProducts: async (_parent) => {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  },

  getAllProductsOfUsersByCategory: async (_parent, { categoryId }, { user }) => {
    try {
      const userMe = await User.findById(user.id).populate('products');
      return userMe.products.filter(product => product.categoryId.toString() === categoryId);
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  },
}

export const productMutationResolver = {
  createProduct: async (_parent, args, { user }) => {
    try {
      const { name, description, price, currency, categoryId } = args;
      // Get the category information, return error message if false
      const category = await Category.findById(categoryId);
      if (!category) return {'message': 'The product category ID must be specified!'};

      const product = new Product({ name, description, price, currency, categoryId: category._id });
      await product.save(); // Save the product first

      const userMe = await User.findById(user.id);
      userMe.products.push(product._id);
      await userMe.save();

      return product; // Return the created product
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  },

  deleteProduct: async (_parent, { id }, { user }) => {
    try {
      const userData = await User.findById(user.id).populate('products');
      const index = userData.products.map(item => item.toString()).indexOf(id);
      if (index == -1) return { 'message': 'This Product does not exist for this user!' };
      userData.products.splice(index, 1);
      const product = await Product.findByIdAndDelete(id);
      if (product) {
        await userData.save();
        return {'message': 'Successfully deleted!'};
      } else return {'message': 'An error occured!'};
    } catch (error) {
      myLogger.error('Error deleting product: ' + error.message);
      return {'message': 'An error occured!'};
    }
  },

  updateProduct: async (_parent, { id, product, categoryId }, { user }) => {
    try {
      // Sanitize users input
      const keys = Object.keys(product);
      const newProduct = keys.filter(key => key !== 'id' || key !== 'createdAt' || key !== 'updatedAt').reduce((obj, key) => {
        obj[key] = product[key];
        return obj;
      }, {});
      const userData = await User.findById(user.id).populate('products');
      const index = userData.products.map(item => item.toString()).indexOf(id);
      if (index == -1) return { 'message': 'This Product does not exist for this user!' };
      newProduct.updatedAt = new Date().toString();
      const category = await Category.findById(categoryId);
      if (!category) return {'message': 'This category does not exist!'};
      // Find the product and update it
      const data = await Product.findByIdAndUpdate(id, product);
      if (!data) return {'message': 'An error occured!'};
      return data;
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  }
}
