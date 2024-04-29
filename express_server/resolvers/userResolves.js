import { User } from '../models/user';
import fetch from 'node-fetch';


const resolvers = {
  Query: {
    users: async () => {
      return await User.find();
    },

    user: async (_parent, args, { user }) => {
      try {
        return await User.findById(user.id);
      } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
      }
    }
  },


  Mutation: {
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
          firstName,
          lastName,
          lgaId, 
          vehicleNumber,
         });
        const savedUser = await newUser.save(); 
        return savedUser;
      } catch (error) {
        throw new Error('Error creating user: ' + error.message);
      }
    },

    login: async (_parent, args, {req, res}) => {
      const { email, password } = args;

      // Login logic using the RESTful API (already implemented)
      const loginResponse = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        return {'message': 'Login failed'};
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;

      return {'message': 'User logged in successfully', 'token': token};
    },

    logout: async (_parent, arg, { user, role}) => {
      // Update the user information to be logged out
      const updated = await User.findByIdAndUpdate(user.id, { isLoggedIn: false });
      if (updated) return {'message': 'Logged out successfully'};
      else return {'message': 'An error occured'};
    },

    updateUser: async (_parent, { username }, { user, role}) => {
      const updated = await User.findByIdAndUpdate(user.id, { username });
      if (updated) return {'message': 'Updated successfully'};
      else return {'message': 'An error occured'};
    },

    deleteUser: async (_parent, _, { user, role }) => {
      try {
        await User.findByIdAndDelete(user.id);
      } catch {
        return {'message': 'An error occurred!'};
      }
      return {'message': 'User deleted successfully!'};
    },
  },
};
module.exports = resolvers;
