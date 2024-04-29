import mongoose from  "mongoose";
import bcrypt from 'bcrypt';
import { locationSchema } from "./location";

const { Schema } = mongoose;

const userschema = new Schema({
  firstName: String,
  lastName: String,
  username: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }},
  passwordHash: String,
  email: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }},
  phoneNumber: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }},
  resetPasswordToken: String,
  createdAt: { type: Date, default: new Date().toString() },
  updatedAt: { type: Date, default: new Date().toString() },
  lgaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  vehicleNumber: String,
  isLoggedIn: {type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  userType: { enum: ['seller', 'buyer', 'dispatcher'], type: String },
  status: { type: String, enum: ['available', 'busy', 'deleted']},
  photo: String,
	address_seller: locationSchema,
	address_buyer: locationSchema,
	address_dispatcher: locationSchema
});

const SALT_ROUNDS = 10
userschema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) {
        return next();
    }
    const salt = await bcrypt.genSalt()
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
});

export const User = mongoose.model('User', userschema);
export const userSchema = userschema;
