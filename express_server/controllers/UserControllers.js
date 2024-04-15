import User from '../models/user';

class UserControllers {
  static async users(req, res) {
    const username = req.body.username;
    const email = req.body.email;
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    await newUser.save(); // Save the user to the database
    const otherUsers = await User.find();
    res.json(otherUsers); // Return the saved user object
  }
}

module.exports = UserControllers;
