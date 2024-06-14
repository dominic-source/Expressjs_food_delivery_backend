import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import Category from '../models/category';
import Bull from 'bull';
import { myLogger } from '../utils/mylogger';
import { authRequest, loginMe } from '../utils/managedata/sendrequest';


export const userQueryResolvers = {
  users: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { isAdmin } = await response.json();
    if (!isAdmin) return { message: 'You need to be an admin to access this route!', statusCode: 403, ok: false };
    try {
      const usersData = await User.find();
      return { usersData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error fetching users: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false};
    }
  },

  user: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();
    try {
      const userData = await User.findById(user._id);
      return { userData, statusCode: response.status, ok: true };
    } catch (error) {
      myLogger.error('Error fetching user: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  category: async (_parent, { id }, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    try {
      const categoryData = await Category.findById(id);
      return { categoryData, statusCode: response.status, ok: true };
    } catch (error) {
      myLogger.error('Error fetching category: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  categories: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    try {
      const categoriesData = await Category.find();
      return { categoriesData, statusCode: response.status, ok: true };
    } catch (error) {
      myLogger.error('Error fetching category: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },
}

export const userMutationResolvers = {
  createCategory: async (_parent, { name }, { req }) => {
    // authenticate user who must be an admin
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { isAdmin } = await response.json();
    if (!isAdmin) return { message: 'You need to be an admin to access this route!', statusCode: 403, ok: false };

    try {
      const listCategories = ['Consumable Products', 'Non-Consumable Products'];

      // Define the category format regex
      const categoryFormat = /^([\w\s]+)\|[\w\s]+\|[\w\s]+$/;

      // Validate category format
      if (!categoryFormat.test(name)) {
        return { message: 'Invalid category format', statusCode: 400, ok: false};
      }

      // Validate input
      const mainName = categoryFormat.exec(name)[1];
      if (!listCategories.includes(mainName)) {
        return { message: 'Invalid category name', statusCode: 400, ok: false};
      }
  
      // Check if category already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return { message: 'Category already exists', statusCode: 400, ok: false};
      }
  
      // Create and save new category
      const category = new Category({ name });
      const categoryData = await category.save();
      return { categoryData, statusCode: 201, ok: true };

    } catch (error) {
      myLogger.error('Error creating category: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false};
    }
  },

  createCategories: async (_parent, { name }, { req }) => {
    // authenticate user who must be an admin
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { isAdmin } = await response.json();
    if (!isAdmin) return { message: 'You need to be an admin to access this route!', statusCode: 403, ok: false };

    if (!Array.isArray(name)) {
      return { message: 'Name must be an array', statusCode: 400, ok: false};
    }
    if (name.length === 0) {
      return { message: 'Name cannot be empty', statusCode: 400, ok: false};
    }
    for (const singleName of name) {
      try {
        const listCategories = ['Consumable Products', 'Non-Consumable Products'];
  
        // Define the category format regex
        const categoryFormat = /^([\w\s]+)\|[\w\s]+\|[\w\s]+$/;
  
        // Validate category format
        if (!categoryFormat.test(singleName)) {
          return { message: 'Invalid category format', statusCode: 400, ok: false};
        }
  
        // Validate input
        const mainName = categoryFormat.exec(singleName)[1];
        if (!listCategories.includes(mainName)) {
          return { message: 'Invalid category name', statusCode: 400, ok: false};
        }
    
        // Check if category already exists
        const existingCategory = await Category.findOne({ name: singleName });
        if (existingCategory) {
          return { message: 'Category already exists', statusCode: 400, ok: false};
        }
    
        // Create and save new category
        const category = new Category({ name: singleName });
        await category.save();
      } catch (error) {
        myLogger.error('Error creating category: ' + error.message);
        return { message: 'An error occurred!', statusCode: 500, ok: false};
      }
    }
    return {'message': 'Many categories have been created successfully!', ok: true, statusCode: 201};
  },

  deleteCategory: async (_parent, { id }, { req }) => {
    // authenticate user who must be an admin
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { isAdmin } = await response.json();
    if (!isAdmin) return { message: 'You need to be an admin to access this route!', statusCode: 403, ok: false };

    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return { message: 'Category not found', statusCode: 404, ok: false};

      }
      return { message: 'Category has been deleted successfully!', statusCode: 201, ok: true };
    } catch(error) {
      myLogger.error('Error deleting category: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  createUser: async (_parent, args) => {
    try {
      const { 
        username,
        email,
        passwordHash,
        phoneNumber,
        userType,
        status,
        firstName,
        lastName,
        lgaId, 
        vehicleNumber,
        } = args;

      // Handle the file upload

      const newUser = new User({
        firstName,
        lastName,
        username,
        email,
        passwordHash,
        phoneNumber,
        userType,
        status,
        lgaId, 
        vehicleNumber,
        });
      const userData = await newUser.save(); 
      return { userData, statusCode: 201, ok: true };
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message)
      return { message: 'An error occurred while creating user', statusCode: 500, ok: false };
    }
  },
  
  login: async (_parent, args) => {
    const { email, password } = args;
    // Login logic using the RESTful API (already implemented)
    const loginResponse = await loginMe(email, password);
    if (!loginResponse.ok) {
      const message = await loginResponse.json();
      return { statusCode: loginResponse.status, message: message.message, ok: loginResponse.ok };
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;

    return { message : 'User logged in successfully', token, statusCode: 200, ok: true };
  },

  logout: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();
  
    // Update the user information to be logged out
    const updated = await User.findByIdAndUpdate(user._id, { isLoggedIn: false });
    if (updated) return {'message': 'Logged out successfully'};
    else return {'message': 'An error occured'};
  },

  updateUser: async (_parent, args, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        lgaId,
        vehicleNumber,
        userType,
        buyerStatus,
        sellerStatus,
        dispatcherStatus,
      } = args;
      const newArgs = {
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        lgaId,
        vehicleNumber,
        userType,
        buyerStatus,
        sellerStatus,
        dispatcherStatus,
      };
      // use map, filter, reduce, etc.
      const keys = Object.keys(newArgs);
      const filteredArgs = keys.reduce((acc, key) => {
        if (newArgs[key] !== undefined) {
          acc[key] = newArgs[key];
        }
        return acc;
      }, {});

      const updated = await User.findByIdAndUpdate(user._id, filteredArgs);
      if (updated) return { message: 'Updated successfully', statusCode: 200, ok: true };
      else return { message: 'An error occurred!', statusCode: 500, ok: false };
    } catch(error) {
      myLogger.error('Error updating user: ' + error.message)
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  forgotPassword: async (_parent, { email }) => {
    try {
      const user = await User.find({ email });
      if (!user[0]) return {'message': 'An error occurred!'};
      const expiryDate = new Date();
      const duration = expiryDate.getHours() + 1;
      expiryDate.setHours(duration);
      const token = uuidv4() + uuidv4();
      const resetPasswordToken = token + ' ' + expiryDate.toISOString();
      await User.findByIdAndUpdate(user[0].id, { resetPasswordToken });
      const user_data = {
        to: email,
        subject: "Reset token for forgot password",
        token,
        uri: undefined
      };
      // Define the queue name
      const queue = new Bull('user_data_queue');
      // Add data to the queue
      await queue.add(user_data);
      return {'message': 'Get the reset token from your email', statusCode: 200, ok: true };
    } catch(error) {
      myLogger.error('Error changing password: ' + error.message);
      return {'message': 'An error occurred!', statusCode: 500, ok: true };
    }
  },

  updatePassword: async (_parent, { email, password, token }) => {
    try {
      const user = await User.find({ email });
      if (!user) return {'message': 'An error occurred!'};
      const resetPasswordToken = user[0].resetPasswordToken.split(' ')[0];
      const expiryDate = new Date(user[0].resetPasswordToken.split(' ')[1]);
      const presentDate = new Date();
      if (expiryDate <= presentDate) return {'message': 'An error occurred!', statusCode: 401, ok: false };
      if (token != resetPasswordToken) return {'message': 'An error occurred!', statusCode: 401, ok: false };
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(user[0].id, { passwordHash });
      return {'message': 'Password updated successfully', statusCode: 200, ok: true };
    } catch(error) {
      myLogger.error('Error updating password: ' + error.message);
      return {'message': 'An error occurred!', statusCode: 500, ok: false }; 
    }
  },

  deleteUser: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();
    try {
      const delUser = await User.findByIdAndUpdate(user._id, { isDeleted: true });
      if(!delUser) return { message: 'Could not delete user!', statusCode: 500, ok: false }
    } catch(error) {
      myLogger.error('Error deleting user: ' + error.message);
      return {'message': 'An error occurred!'};
    }
    return { message: 'User deleted successfully!', statusCode: 200, ok: true };
  },
}
