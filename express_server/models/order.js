import mongoose from  "mongoose";
import { orderItemSchema } from "./orderItem";
import { paymentSchema } from "./payment";
import { Product } from "./product";
import { OrderItem } from "./orderItem";


const { Schema } = mongoose;

const orderSchema = new Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dispatcherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderDateTime: { type: Date, default: new Date().toString()},
  deliveryAddress: String,
  currency: String,
  totalAmount: Number,
  status: { enum: ['complete', 'incomplete', 'pending'], type: String, default: 'incomplete' },
  orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
  payment: [paymentSchema],
});

orderSchema.pre('save', async function(next) {
  // this.totalAmount =
  const items = this.orderItems;
  let totalAmount = 0
  for (const item of items) {
    const orderitem = await OrderItem.findById(item._id.toString());
    if (orderitem) {
      const product = await Product.findById(orderitem.productId.toString());
      totalAmount += product.price * orderitem.quantity;
    }
  }
  this.totalAmount = totalAmount;
  next();
});
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
