import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import emailClient from '../emailclient';

const resolvers = {
  Query: {
    users: async (_parent, args, { user }) => {
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

    updateUser: async (_parent, args, { user, role}) => {
      try {
        const updated = await User.findByIdAndUpdate(user.id, args);
        if (updated) return {'message': 'Updated successfully'};
        else return {'message': 'An error occurred!'};
      } catch {
        return {'message': 'An error occurred!'};
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
        await emailClient.mailMe({
          to: email,
          subject: "Reset token for forgot password",
          token,
          uri: undefined
        });

        return {'message': 'Get the reset token from your email', 'token': token};
      } catch(err) {
        console.log(err);
        return {'message': 'An error occurred!'};
      }
    },

    updatePassword: async (_parent, { email, password, token }) => {
      try {
        const user = await User.find({ email });
        if (!user) return {'message': 'An error occurred!'};
        const resetPasswordToken = user[0].resetPasswordToken.split(' ')[0];
        const expiryDate = new Date(user[0].resetPasswordToken.split(' ')[1]);
        const presentDate = new Date();
        if (expiryDate <= presentDate) return {'message': 'An error occurred!'};
        if (token != resetPasswordToken) return {'message': 'An error occurred!'};
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate(user[0].id, { passwordHash });
        return {'message': 'Password updated successfully', 'token': user[0].passwordHash};
      } catch(err) {
        console.log(err);
        return {'message': 'An error occurred!'}; 
      }
    },

    deleteUser: async (_parent, _, { user, role }) => {
      try {
        await User.findByIdAndUpdate(user.id, { isDeleted: true });
      } catch {
        return {'message': 'An error occurred!'};
      }
      return {'message': 'User deleted successfully!'};
    },
  },
};
module.exports = resolvers;
