import { myLogger } from '../utils/mylogger';
import { Payment } from '../models/payment';
import Order from '../models/order';
import { paymentMethods, currency } from '../../configPayment.json'

const availableCurrency = currency;

export const paymentQueryResolver = {
  getMyPayment: async (_parent, { orderId }, { user }) => {
    try {
      const order = await Order.findById(orderId).populate('payment');
      if (!order) return [];
      if (!(order.buyerId.toString() === user.id ||
        order.sellerId.toString() === user.id ||
          order.dispatcherId.toString() === user.id)) {
            return [];
      }
      return order.payment;
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return [];
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
      const order = await Order.findById(pay.orderId);
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
      } else if (pay.sellerPaymentStatus !== 'paid' || pay.dispatcherPaymentStatus !== 'paid'){
        order.status = 'incomplete';
        await order.save();
      }
      await pay.save();
      return {'message': 'Payment was successfully updated!', 'id': pay._id.toString()};
    } catch (error) {
      myLogger.error('Error updating payment: ' + error.message);
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
      const order = await Order.findById(orderId)
      if (!order) return {'message': 'Order not found'};
      if (order.buyerId.toString() !== user.id) return {'message': 'Unauthorized'};
      if (!paymentMethods.includes(paymentMethod)) return {'message': 'payment method is not allowed'};
      if (!availableCurrency.includes(currency)) return {'message': 'currency not available for transaction'};
      if (sellerAmount < 0 || dispatcherAmount < 0) return {'message': 'Invalid amount'};
      const pay = new Payment({
        orderId,
        paymentMethod,
        currency,
        sellerAmount,
        dispatcherAmount
      });
      await pay.save();
      order.payment.push(pay._id);
      await order.save()

      return {'message': 'Payment was successfully created!', 'id': pay._id.toString()};
    } catch (error) {
      myLogger.error('Error creating user: ' + error.message);
      return  {'message': 'An error occurred while processing payment'};
    }
  },
}
