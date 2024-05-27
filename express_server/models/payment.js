import mongoose from  "mongoose";
import { paymentStatus, paymentMethods, currency } from '../../configPayment.json'

const { Schema } = mongoose;

const paymentschema = new Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  paymentDateTime: { type: Date},
  lastUpdateTime: { type: Date, default: new Date().toString()},
  paymentMethod: { enum: paymentMethods, type: String, default: paymentMethods[0] },
  currency: { enum: currency, type: String, default: currency[1] },
  sellerAmount: { type: Number, default: 0 },
  dispatcherAmount: { type: Number, default: 0 },
  sellerPaymentStatus: { enum: paymentStatus, type: String, default: paymentStatus[1] },
  dispatcherPaymentStatus: { enum: paymentStatus, type: String, default: paymentStatus[1] },
  isDeleted: { type: Boolean, default: false },
});

export const paymentSchema = paymentschema;
export const Payment = mongoose.model('Payment', paymentschema);
