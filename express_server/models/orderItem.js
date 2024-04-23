import mongoose from  "mongoose";

const { Schema } = mongoose;

const orderItemschema = new Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  comments: String,
  ratings: Number
});

export const orderItemSchema = orderItemschema;
export const OrderItem = mongoose.model('OrderItem', orderItemschema);
