import mongoose from  "mongoose";
import { currency } from '../../configPayment.json'
const { Schema } = mongoose;

const productschema = new Schema({
  name: String,
  description: String,
  price: Number,
  currency: { enum: currency, type: String, default: currency[1] },
  photo: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export const productSchema = productschema;
export const Product = mongoose.model('Product', productschema);
