import { User } from '../models/user';

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
    },
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
    updateUser: async (_parent, { id, username, email }) => {
      const updatedUser = await User.findByIdAndUpdate(id, { username, email }, { new: true });
      return updatedUser;
    },
    deleteUser: async (_parent, { id }) => {
      await User.findByIdAndDelete(id);
      return 'User deleted successfully!';
    },
  },
};
module.exports = resolvers;
