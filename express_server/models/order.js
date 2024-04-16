import mongoose from  "mongoose";
import { orderItemSchema } from "./orderItem";
import { paymentSchema } from "./payment";

const { Schema } = mongoose;

const orderSchema = new Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderDateTime: { type: Date, default: new Date().toString()},
  deliveryAddress: String,
  currency: String,
  totalAmount: Number,
  status: { enum: ['complete', 'incomplete', 'pending'], type: String, default: 'incomplete' },
  orderItems: [orderItemSchema],
  payment: [paymentSchema]
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
