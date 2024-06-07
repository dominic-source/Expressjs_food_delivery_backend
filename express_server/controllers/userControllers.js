import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { myLogger } from '../utils/mylogger';

class UserControllers {
  static async login(req, res) {
    // this login route is used to login user from the graphql endpoint

    // Extract the email and password
    const email = req.body.email || '';
    const password = req.body.password || '';
    // Verify if the email and password are authentic
    if (email == '' || password == '') {
      return res.status(401).json({'error': 'provide more information'});
    }
    try {
      // find the user based on the email and return error if the user does not exist
      // Verify if the password is not correct and return error
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update user information to be loggedIn
      await User.findByIdAndUpdate(user.id, {isLoggedIn: true});
      // Generate JWT with user ID and expiration time 
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
          expiresIn: "24h",
      });

      return res.json({ token });
    } catch (error) {
      myLogger.error('Error logging in user: ' + error.message);
      return res.status(400).json({ message: 'An error occurred!' });
    }
  }

  static async upload(req, res) {
    const id = req.body.id;
    if (!id || typeof id != 'string') {
      // delete file when this error occurs
      return res.status(401).json({'error': 'Id is required!'});
    }
    try {
      const user = await User.findByIdAndUpdate(id, { photo: req.file.filename});
      if (!user) {
        // delete file when this error occurs
        return res.status(404).json({'error': 'not found'});
      }
    } catch(error) {
      myLogger.error('Error creating user: ' + error.message);
    }
    return res.json({ id }); // Return the saved user object
  }
}

module.exports = UserControllers;
