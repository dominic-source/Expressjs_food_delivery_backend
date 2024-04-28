import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


class UserControllers {
  static async login(req, res) {
    const email = req.body.email || '';
    const password = req.body.password || '';
    if (email == '' || password == '') {
      return res.status(401).json({'error': 'provide more information'});
    }
    try {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // Update user information to be loggedIn
      const user2 =  await User.findByIdAndUpdate(user.id, {isLoggedIn: true});
      // console.log(user2.isLoggedIn, user2.email, user.id);
      // Generate JWT with user ID and expiration time 
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
          expiresIn: "24h", // 1 hour in seconds
      });

      return res.json({ token });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
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
    } catch(err) {
      console.log("An error occurred!", err);
    }
    return res.json({ id }); // Return the saved user object
  }
}

module.exports = UserControllers;
