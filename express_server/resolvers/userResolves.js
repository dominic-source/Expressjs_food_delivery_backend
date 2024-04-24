import { User } from '../models/user';
import { allowedExtensions } from '../app';
import { createWriteStream, unlinkSync} from 'fs';

const resolvers = {
  Query: {
    users: async () => {
      const users = await User.find();
      return users;
    },
    user: async (_parent, args) => {
      return await User.findOne({ ...args });
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
          file
         } = args;

        // Handle the file upload
        const { createReadStream, filename, mimetype, encoding } = await file;

        // Renames the file
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        if (allowedExtensions(filename, mimetype)) {
          filename = uniquePrefix + '-' + file.fieldname;
        } else filename = file.fieldname + '-' + uniquePrefix;

        const stream = createReadStream();
        const path = './static/uploads';
        
        await Promise(resolve => stream.pipe(createWriteStream(path, encoding=encoding))
          .on('finish', resolve)
          .on('error', error => {
            unlinkSync(path);
              return 'Cannot upload file for now'
          })
        );
  
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
          photo: filename
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
