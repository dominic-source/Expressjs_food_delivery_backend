import mongoose from  "mongoose";

const { Schema } = mongoose;

const orderItemschema = new Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dispatcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderDateTime: { type: Date, default: Date.now },
  deliveryAddress: String,
  currency: String,
  totalAmount: Number,
  status: { enum: ['complete', 'incomplete', 'pending'], type: String, default: 'incomplete' },

});

export const orderItemSchema = orderItemschema;
export const OrderItem = mongoose.Model('OrderItem', orderItemschema);
