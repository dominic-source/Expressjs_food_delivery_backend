import mongoose from  "mongoose";
import { locationSchema } from "./location";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  passwordHash: String,
  email: String,
  phoneNumber: String,
  address: locationSchema,
  createdAt: { type: Date, default: new Date().toString() },
  updatedAt: { type: Date, default: new Date().toString() },
  lgaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  vehicleNumber: String,
  userType: { enum: ['seller', 'buyer', 'dispatcher'], type: String },
  status: { type: String, enum: ['available', 'busy']},
  photo: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
