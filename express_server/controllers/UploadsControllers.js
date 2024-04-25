import { User } from '../models/user';
import { ObjectId } from 'mongodb';


class UploadsControllers {
  static async upload(req, res) {
    const id = req.body.id;
    console.log(id);
    if (!id || typeof id != 'string') {
      // delete file when this error occurs
      return res.status(401).json({'error': 'Id is required!'});
    }
    try {
      const user = await User.findByIdAndUpdate(id, { photo: req.file.filename});
      if (!user) {
        // delete file when this error occurs
        return res.status(401).json({'error': 'Id not found!'});
      }
      console.log("successful");
    } catch(err) {
      console.log("An error occurred!", err);
    }
    return res.json({ id }); // Return the saved user object
  }
}

module.exports = UploadsControllers;
