import mongoose from  "mongoose";
import { locationSchema } from "./location";

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  passwordHash: String,
  email: String,
  phoneNumber: String,
  address: locationSchema,
  createAt: { type: Date, default: Date.now },
  lgaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  vehicleNumber: String,
  userType: { enum: ['seller', 'buyer', 'dispatcher'], type: String },
  status: { type: String, enum: ['available', 'busy']},
  photo: String,
});

const User = mongoose.Model('User', userSchema);
module.exports = User;
