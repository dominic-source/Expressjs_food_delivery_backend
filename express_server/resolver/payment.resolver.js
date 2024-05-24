import { myLogger } from '../utils/mylogger';
import { Payment } from '../models/payment';
import Order from '../models/order';

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

}
