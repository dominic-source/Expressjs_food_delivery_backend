import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { locationSchema } from "./location";

const { Schema } = mongoose;

const userschema = new Schema({
  firstName: { type: String, maxlength: 50 },
  lastName: { type: String, maxlength: 50 },
  username: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 50 },
  passwordHash: String,
  email: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 100 },
  phoneNumber: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 50 },
  resetPasswordToken: String,
  createdAt: { type: Date, default: new Date().toString() },
  updatedAt: { type: Date, default: new Date().toString() },
  lgaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  vehicleNumber: String,
  isLoggedIn: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  userType: { type: String, enum: ['seller', 'buyer', 'dispatcher'], default: 'buyer' },
  sellerStatus: { type: String, enum: ['available', 'busy', 'null'], default: 'null' },
  dispatcherStatus: { type: String, enum: ['available', 'busy', 'null'], default: 'null' },
  buyerStatus: { type: String, enum: ['available', 'busy', 'null'], default: 'null' },
  photo: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  addressSeller: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  addressBuyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  addressDispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  businessDescription: { type: String, maxlength: 300 },
});


userschema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }
  const salt = await bcrypt.genSalt()
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

export const User = mongoose.model('User', userschema);
export const userSchema = userschema;
