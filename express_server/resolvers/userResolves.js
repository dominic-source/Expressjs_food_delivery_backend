import User from '../models/user';

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users;
    },
    user: async (_parent, { id }) => {
      return await User.findById(id);
    },
  },
  Mutation: {
    createUser: async (_parent, args) => {
      try {
        const { username, email } = args; // Destructure username and email from args
        const newUser = new User({ username, email }); // Create a new User object with mapped fields
        const savedUser = await newUser.save(); // Save the user to the database
        return savedUser; // Return the saved user object
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
