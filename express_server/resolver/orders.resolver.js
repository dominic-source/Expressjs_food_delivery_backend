import { myLogger } from '../utils/mylogger';
import Order from '../models/order';
import { OrderItem } from '../models/orderItem';
import { User } from '../models/user';
import { Product } from '../models/product'
import { deleteOrderItems } from '../utils/managedata/deletemodels';

export const ordersQueryResolver = {
  getAllOrders: async (_parent) => {
    try {
      return await Order.find();
    } catch (error) {
      return [];
    }
  },
  getMyOrders: async (_parent, _, { user }) => {
    // This endpoint will get all the users orders as a buyer
    try {
      return await Order.find({
        buyerId: user.id,
      });
    } catch (error) {
      return [];
    }

  },
  getMyOrderItems: async (_parent, { orderId }, { user }) => {
    // This endpoint will get all the order items of the users order
    // In this endpoint, we are find a single order with id = orderId where the user is 
    // either a seller, buyer or dispatcher.
    try {
      const order = await Order.find({
        $or: [
          { buyerId: user.id },
          { sellerId: user.id },
          { dispatcherId: user.id },
        ],
        _id: orderId,
      });
      if (!order) return [];
      return await OrderItem.find({ _id: { $in: order[0].orderItems } });

    } catch (error) {
      return [];
    }
  },
  getTheOrderAsSeller: async (_parent, _, { user }) => {
    // This endpoint retrieves a sellers order
    try {
      return await Order.find({
        sellerId: user.id,
      });
    } catch (error) {
      return [];
    }
  },
  getTheOrderAsDispatcher: async (_parent, _, { user }) => {
    // This endpoint retrieves a dispatchers order
    try {
      return await Order.find({
        dispatcherId: user.id
      });
    } catch (error) {
      return [];
    }
  },
  // getAnOrderItem: async (_parent, { orderItemId }) => {
  //   // This endpoint retrieves a single order item
  //   // it is only for testing purposes
  //   return await OrderItem.findById(orderItemId);
  // }
}

export const ordersMutationResolver = {
  updateOrderItems: async (_parent, { orderId, orderItems }, { user }) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { 'message': 'Order does not exist!' };
      if (!(order.buyerId == user.id || order.sellerId == user.id)) return { 'message': 'You are not authorized to delete this order item!' };
      if (order.payment && order.payment.paymentStatus === 'paid') return { 'message': 'You cannot delete a paid orders item!' };

      if (orderItems) {
        for (const item of orderItems) {
          const orderItem = await OrderItem.findById(item.id);
          if (orderItem && order.orderItems.includes(item.id)) {
            orderItem.quantity = item.quantity;
            await orderItem.save();
          }
        }
      }
      // This save must be called to update the total Amount in the order
      await order.save();
      return { 'message': 'Order items were updated successfully!', 'id': orderId };
    } catch (error) {
      console.log(error);
      return { 'message': 'An error occurred!' };
    }

  },

  deleteAnOrderItem: async (_parent, { orderId, orderItemId }, { user }) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return { 'message': 'Order does not exist!' };
      if (!(order.buyerId == user.id || order.sellerId == user.id)) return { 'message': 'You are not authorized to delete this order item!' };
      if (order.payment && order.payment.paymentStatus === 'paid') return { 'message': 'You cannot delete a paid orders item!' };
      if (order.payment && order.payment.paymentStatus === 'inprocess') {
        const lastUpdateTime = new Date(order.payment.lastUpdateTime);
        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - 3600000);
        const diff = oneHourAgo > lastUpdateTime;
        if (diff) return { 'message': 'You cannot delete an order item that is in process!' };
      }
      const index = order.orderItems.indexOf(orderItemId);
      if (index === -1) return { 'message': 'Order item does not exist!' };
      order.orderItems.splice(index, 1);

      // Delete the order item
      await OrderItem.findByIdAndDelete(orderItemId);

      // This save must be called to update the total Amount in the order
      await order.save();

      return { 'message': 'Order item was deleted successfully!' };
    } catch (error) {
      return { 'message': 'An error occurred!' };
    }
  },

  deleteOrder: async (_parent, { orderId }, { user }) => {
    // This endpoint will delete a order
    try {
      const order = await Order.findById(orderId);
      if (!order) return { 'message': 'Order does not exist!' };
      if (!(order.buyerId == user.id || order.sellerId == user.id)) return { 'message': 'You are not authorized to delete this order!' };
      if (order.payment && order.payment.paymentStatus === 'paid') return { 'message': 'You cannot delete a paid order!' };
      if (order.payment && order.payment.paymentStatus === 'inprocess') {
        const lastUpdateTime = new Date(order.payment.lastUpdateTime);
        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - 3600000);
        const diff = oneHourAgo > lastUpdateTime;
        if (diff) return { 'message': 'You cannot delete a order that is in process!' };
      }
      deleteOrderItems(order.orderItems);
      order.populate('payment');
      for (const payment of order.payment) {
        payment.isDeleted = true;
        payment.lastUpdateTime = new Date().toString();
        await payment.save();
      }
      await Order.findByIdAndDelete(orderId);
      return { 'message': 'Order was deleted successfully!' };
    } catch (error) {
      return { 'message': 'An error occurred!' };
    }
  },

  updateOrderAddress: async (_parent, { orderId, deliveryAddress }, { user }) => {
    // This endpoint will update a order
    // Only the buyer should be able to update the delivery address
    const order = await Order.findById(orderId);
    if (!order) return { 'message': 'Order does not exist!' };
    if (order.buyerId != user.id) return { 'message': 'You are not authorized to update this order!' };
    order.deliveryAddress = deliveryAddress;
    await order.save();
    return { 'message': 'Order was updated successfully!', 'id': orderId };
  },

  deleteOrderItemsNow: async (_parent, { ids }) => {
    // This is an admin route or endpoint   
    deleteOrderItems(ids);
    return { 'message': 'Order items may have been deleted successfully!' };
  },

  createOrder: async (_parent, args, { user }) => {
    const {
      sellerId,
      dispatcherId,
      deliveryAddress,
      orderItems,
    } = args;
    const buyerId = user.id;
    let createdItems = [];
    try {

      // Verify if the seller exist or not
      const seller = await User.findById(sellerId);
      if (!seller) return { 'message': 'An error occurred!' };

      // Verify if the dispatcher exist or not and is available
      if (dispatcherId) {
        const dispatcher = await User.findById(dispatcherId);
        if (!dispatcher) return { 'message': 'An error occurred!' };
        if (dispatcher.dispatcherStatus !== 'available') return { 'message': 'Dispatcher is not available' };
      }
      let currency;
      let totalAmount = 0;
      // create each item one by one
      for (const data of orderItems) {
        // verify if the productId exist
        const product = await Product.findById(data.productId);
        // get currency
        currency = product.currency;
        // calculate total amount
        if (!data.quantity) data.quantity = 1;
        totalAmount += product.price * data.quantity;
        if (!product) {
          deleteOrderItems(createdItems);
          return { 'message': 'Product does not exist!' };
        }
        const item = new OrderItem(data);
        await item.save();
        createdItems.push(item._id);
      }

      // create the order
      const newOrder = new Order({
        sellerId,
        dispatcherId,
        buyerId,
        deliveryAddress,
        currency,
        totalAmount,
        orderItems: createdItems,
      });
      await newOrder.save();
      return { 'message': 'Order was created successfully!', 'id': newOrder._id }
    } catch (error) {
      // Delete any created order items
      if (createdItems) deleteOrderItems(createdItems);
      myLogger.error('Error creating orders: ' + error.message);
      return { 'message': 'An error occurred!' };
    }
  },
}
