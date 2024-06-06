import mongoose from  "mongoose";
import bcrypt from 'bcrypt';
import { locationSchema } from "./location";

const { Schema } = mongoose;

const userschema = new Schema({
  firstName: { type: String, maxlength: 20 },
  lastName: { type: String, maxlength: 20 },
  username: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 20},
  passwordHash: String,
  email: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 20},
  phoneNumber: { type: String, required: true, unique: true, collation: { locale: 'en', strength: 2 }, maxlength: 20},
  resetPasswordToken: String,
  createdAt: { type: Date, default: new Date().toString() },
  updatedAt: { type: Date, default: new Date().toString() },
  lgaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  vehicleNumber: String,
  isLoggedIn: {type: Boolean, default: false},
  isDeleted: {type: Boolean, default: false},
  role: { type: String, default: 'user' },
  userType: { enum: ['seller', 'buyer', 'dispatcher'], type: String },
  sellerStatus: { type: String, enum: ['available', 'busy', 'deleted']},
  dispatcherStatus: { type: String, enum: ['available', 'busy', 'deleted']},
  buyerStatus: { type: String, enum: ['available', 'busy', 'deleted']},
  photo: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
	address_seller: locationSchema,
	address_buyer: locationSchema,
	address_dispatcher: locationSchema
});


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
