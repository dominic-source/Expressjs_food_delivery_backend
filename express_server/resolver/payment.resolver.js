import { myLogger } from '../utils/mylogger';
import { Payment } from '../models/payment';
import Order from '../models/order';
import { paymentStatus, paymentMethods, currency } from '../../configPayment.json'

const availableCurrency = currency;

export const paymentQueryResolver = {
  getMyPayment: async (_parent, { orderId }, { user }) => {
    try {
      const order = await Order.findById(id=orderId).populate('payment');
      if (!order) return [];
      if (!(order.buyerId.toString() === user.id ||
        order.sellerId.toString() === user.id ||
          order.dispatcherId.toString() === user.id)) {
            return [];
          }
      return order.payment;
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return null;
    }
  },
}

export const paymentMutationResolver = {
  updatePayment: async (_parent, {
    paymentId,
    status
      }, { user }) => {
    try {
      const pay = await Payment.findById(paymentId);
      if (!pay) return {'message': 'Payment not found'};
      const order = await Order.findById(id=pay.orderId);
      if (!order) return {'message': 'Order not found'};
      if (order.sellerId.toString() === user.id) {
        pay.sellerPaymentStatus = status;
      } else if (order.dispatcherId.toString() === user.id) {
        pay.dispatcherPaymentStatus = status;
      } else {
        return {'message': 'Unauthorized'};
      }
      pay.lastUpdateTime = new Date().toString();
      pay.paymentDateTime = new Date().toString();
      if (pay.sellerPaymentStatus === 'paid' && pay.dispatcherPaymentStatus === 'paid'){
        order.status = 'completed';
        await order.save();
      } else if (pay.sellerPaymentStatus === 'inprocess' || pay.dispatcherPaymentStatus === 'inprocess'){
        order.status = 'incomplete';
        await order.save();
      } else {
        return {'message': 'An error occured in your input!'};
      }
      await pay.save();
      return {'message': 'Payment was successfully updated!'};
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return {'message': 'An error occurred while processing payment'};
    }
  },

  createPayment: async (_parent, {
    orderId,
    paymentMethod,
    currency,
    sellerAmount,
    dispatcherAmount,
      }, { user }) => {
    try {
      const order = await Order.findById(id=orderId)
      if (!order) return {'message': 'Order not found'};
      if (order.buyerId.toString() !== user.id) return {'message': 'Unauthorized'};
      if (!paymentMethods.includes(paymentMethod)) return {'message': 'payment method is not allowed'};
      if (!availableCurrency.includes(currency)) return {'message': 'currency not available for transaction'};
      const pay = new Payment({
        orderId,
        paymentMethod,
        currency,
        sellerAmount,
        dispatcherAmount
      });
      order.payment.push(pay._id);
      await order.save()
      await pay.save();
      return {'message': 'Payment was successfully created!'};
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return  {'message': 'An error occurred while processing payment'};
    }
  },
}
