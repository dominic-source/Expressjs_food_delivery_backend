import { myLogger } from '../utils/mylogger';
import { Product } from '../models/product';
import Category from '../models/category';
import { User } from '../models/user';


export const productQueryResolver = {
  getProduct: async (_parent, { id }) => {
    try {
      const productData = await Product.findById(id);
      if(!productData) return { message: 'No product was found!', statusCode: 404, ok: false }
      return { productData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting product: ' + error.message);
      return { message: 'An error occured!', statusCode: 500, ok: false };
    }
  },

  getUserProducts: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();

    try {
      const userMe = await User.findById(user._id).populate('products');
      const productsData = userMe.products;
      return { productsData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting users product: ' + error.message);
      return { message: 'An error occured!', statusCode: 500, ok: false };
    }
  },

  getAllProducts: async (_parent) => {
    try {
      const productsData = await Product.find();
      if(!productsData) return { message: 'No product was found!', statusCode: 404, ok: false }
      return { productsData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting all products: ' + error.message);
      return { message: 'An error occured!', statusCode: 500, ok: false };
    }
  },

  getAllProductsOfUsersByCategory: async (_parent, { categoryId }, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();

    try {
      const userMe = await User.findById(user._id).populate('products');
      const productsData = userMe.products.filter(product => product.categoryId.toString() === categoryId);
      return { productsData, statusCode: 200, ok: true };

    } catch (error) {
      myLogger.error('Error getting products ' + error.message);
      return { message: 'An error occured!', statusCode: 500, ok: false };
    }
  },
}

export const productMutationResolver = {
  createProduct: async (_parent, args, { user }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();

    try {
      const { name, description, price, currency, categoryId } = args;
      // Get the category information, return error message if false
      const category = await Category.findById(categoryId);
      if (!category) return {'message': 'The product category ID must be specified!', statusCode: 400, ok: false };

      const productData = new Product({ name, description, price, currency, categoryId: category._id });
      await productData.save(); // Save the product first

      const userMe = await User.findById(user._id);
      userMe.products.push(productData._id);
      await userMe.save();

      // Return the created product
      return { productData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error creating product: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  deleteProduct: async (_parent, { id }, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();

    try {
      const userData = await User.findById(user._id).populate('products');
      const index = userData.products.map(item => item.toString()).indexOf(id);
      if (index == -1) return { 'message': 'This Product does not exist for this user!', statusCode: 404, ok: false };
      userData.products.splice(index, 1);
      const product = await Product.findByIdAndDelete(id);
      if (product) {
        await userData.save();
        return { 'message': 'Successfully deleted!', statusCode: 200, ok: true };
      } else return { 'message': 'An error occurred!', statusCode: 401, ok: false };
    } catch (error) {
      myLogger.error('Error deleting product: ' + error.message);
      return { 'message': 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  updateProduct: async (_parent, { id, product, categoryId }, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();

    try {
      // Sanitize users input
      const keys = Object.keys(product);
      const newProduct = keys.filter(key => key !== 'id' || key !== 'createdAt' || key !== 'updatedAt').reduce((obj, key) => {
        obj[key] = product[key];
        return obj;
      }, {});
      const userData = await User.findById(user._id).populate('products');
      const index = userData.products.map(item => item.toString()).indexOf(id);
      if (index == -1) return { 'message': 'This Product does not exist for this user!', statusCode: 404, ok: false };
      newProduct.updatedAt = new Date().toString();
      const category = await Category.findById(categoryId);
      if (!category) return { 'message': 'This category does not exist!', statusCode: 404, ok: false };
      // Find the product and update it
      const productData = await Product.findByIdAndUpdate(id, product);
      if (!productData) return {'message': 'Could not update product!', statusCode: 400, ok: false };
      return { productData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error updating product: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false};
    }
  }
}
