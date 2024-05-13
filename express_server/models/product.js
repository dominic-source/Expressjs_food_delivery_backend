import mongoose from  "mongoose";
import { currency } from '../../configPayment.json'
const { Schema } = mongoose;

const productschema = new Schema({
  name: String,
  description: String,
  price: Number,
  createdAt: { type: Date, default: new Date().toString() },
  updatedAt: { type: Date, default: new Date().toString() },
  currency: { enum: currency, type: String, default: currency[1] },
  photo: String,
  quantity: { type: Number, default: 0},
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
});

export const productSchema = productschema;
export const Product = mongoose.model('Product', productschema);
