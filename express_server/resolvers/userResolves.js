import { User } from '../models/user';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';


const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users;
    },
    user: async (_parent, args) => {
      const { id } = args;
      try {
        const user = await User.findById(id).exec();
        return user;
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
        return 'Login failed';
      }

      const loginData = await loginResponse.json();
      const token = loginData.token;
      // Set the JWT in a cookie
      return {'message': 'User logged in successfully', 'token': token};
    },

    logout: async (_parent, arg, { req, res}) => {
      const reqHeader = req.headers.authorization
      if (!reqHeader || !reqHeader.startsWith('Bearer ')) {
        return {'message': 'Unauthorized!'};
      }
      const verified = jwt.verify(reqHeader.split(' ')[1] || '', process.env.SECRET_KEY, async function(err, decoded) {
        if (err || !decoded) {
          return false;
        }
        // console.log(decoded);
        const id = decoded.userId;
        const user = await User.findByIdAndUpdate(id, {isLoggedIn: false});
        if (!user) return false;
        return true;
      });
      if (verified) return {'message': 'Logged out successfully'};
      else return {'message': 'An error occurred!'};
    },

    updateUser: async (_parent, { id, username }, { req, res}) => {
      const reqHeader = req.headers.authorization
      if (!reqHeader || !reqHeader.startsWith('Bearer ')) {
        return {'message': 'Unauthorized!'};
      }
      const verified = jwt.verify(reqHeader.split(' ')[1] || '', process.env.SECRET_KEY, async function(err, decoded) {
        if (err || !decoded) {
          return false;
        }
        const user = await User.findById(id);
        if (!user || !user.isLoggedIn) {
          return false;
        }
        await User.findByIdAndUpdate(id, { username });
        return true;
      });
      if (verified) return {'message': 'Updated successfully'};
      else return {'message': 'Unauthorized'};
    },

    deleteUser: async (_parent, { id }) => {
      await User.findByIdAndDelete(id);
      return 'User deleted successfully!';
    },
  },
};
module.exports = resolvers;
