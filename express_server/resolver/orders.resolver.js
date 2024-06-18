import { myLogger } from '../utils/mylogger';
import Order from '../models/order';
import { OrderItem } from '../models/orderItem';
import { User } from '../models/user';
import { Product } from '../models/product'
import { deleteOrderItems } from '../utils/managedata/deletemodels';
import { authRequest } from '../utils/managedata/sendrequest';
import _ from 'lodash';

export const ordersQueryResolver = {
  getAllOrders: async (_parent, _, { req }) => {
    // authenticate user as admin
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { isAdmin } = await response.json();
    if (!isAdmin) return { message: 'You need to be an admin to access this route!', statusCode: 403, ok: false };
    try {
      const ordersData = await Order.find();
      return { ordersData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting all orders: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false};
    }
  },

  getMyOrders: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }

    const { user } = await response.json();
    // This endpoint will get all the users orders as a buyer
    try {
      const ordersData = await Order.find({
        buyerId: user._id,
      });
      return { ordersData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting my order as buyer : ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }

  },

  getMyOrderItems: async (_parent, { orderId }, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }

    const { user } = await response.json();
    
    // This endpoint will get all the order items of the users order
    // In this endpoint, we are find a single order with id = orderId where the user is 
    // either a seller, buyer or dispatcher.
    try {
      const order = await Order.find({
        $or: [
          { buyerId: user._id },
          { sellerId: user._id },
          { dispatcherId: user._id },
        ],
        _id: orderId,
      });
      if (!order) return { message: 'Order not found!', statusCode: 404, ok: false };
      const orderItems = await OrderItem.find({ _id: { $in: order[0].orderItems } });
      return { orderItems, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting my order items: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  getTheOrderAsSeller: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }

    const { user } = await response.json();

    // This endpoint retrieves a sellers order
    try {
      const ordersData =  await Order.find({
        sellerId: user._id,
      });
      return { ordersData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting order as seller: ' + error.message);

      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  getTheOrderAsDispatcher: async (_parent, _, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }

    const { user } = await response.json();
    
    // This endpoint retrieves a dispatchers order
    try {
      const ordersData = await Order.find({
        dispatcherId: user._id
      });
      return { ordersData, statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error getting order as dispatcher: ' + error.message);
      return { message: 'An error occurred!', statusCode: 500, ok: false };
    }
  },
  // getAnOrderItem: async (_parent, { orderItemId }) => {
  //   // This endpoint retrieves a single order item
  //   // it is only for testing purposes
  //   return await OrderItem.findById(orderItemId);
  // }
}

export const ordersMutationResolver = {
  updateOrderItems: async (_parent, { orderId, orderItems }, { req }) => {
    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();
    // Uses the user._id as a string instead of object
    user.id = user._id.toString();
    try {
      const order = await Order.findById(orderId).populate('payment');
      if (!order) return { 'message': 'Order does not exist!', statusCode: 404, ok: false };
      if (!(order.buyerId.toString() == user.id)) return { 'message': 'You are not authorized to update this order item!', statusCode: 401, ok: false };
      if (order.payment && order.payment[0].sellerPaymentStatus === 'paid') return { 'message': 'You cannot update a paid orders item!', statusCode: 401, ok: false };
      if (order.payment && order.payment[0].dispatcherPaymentStatus === 'paid') return { 'message': 'You cannot update a paid orders item!', statusCode: 401, ok: false };
      if(!orderItems) return { 'message': 'Order items must be provided!', statusCode: 400, ok: false };
      if (!Array.isArray(orderItems)) return { 'message': 'Order items must be an array!', statusCode: 400, ok: false };
      for (const item of orderItems) {
        const orderItem = await OrderItem.findById(item.id);
        if (orderItem && order.orderItems.includes(item.id)) {
          orderItem.quantity = item.quantity;
          await orderItem.save();
        }
      }
      // This save must be called to update the total Amount in the order
      await order.save();
      return { 'message': 'Order items were updated successfully!', 'id': orderId, statusCode: 201, ok: true };
    } catch (error) {
      myLogger.error('Error in updating orders: ' + error.message);
      return { 'message': 'An error occurred!', statusCode: 500, ok: false };
    }

  },

  deleteAnOrderItem: async (_parent, { orderId, orderItemId }, { req }) => {
      // authenticate user
      const response = await authRequest(req.headers.authorization);
      if (!response.ok) {
        const message = await response.json();
        return { statusCode: response.status, message: message.message, ok: response.ok };
      }
      const { user } = await response.json();
  
    try {
      const order = await Order.findById(orderId).populate('payment');
      if (!order) return { 'message': 'Order does not exist!', statusCode: 404, ok: false  };
      if (!(order.buyerId == user._id || order.sellerId == user._id)) return { 'message': 'You are not authorized to delete this order item!', statusCode: 401, ok: false };
      if (order.payment && (order.payment[0].sellerPaymentStatus === 'paid' || order.payment[0].dispatcherPaymentStatus === 'paid')) return { 'message': 'You cannot delete a paid orders item!', statusCode: 401, ok: false  };
      if (order.payment && (order.payment[0].sellerPaymentStatus === 'inprocess' || order.payment[0].dispatcherPaymentStatus === 'inprocess')) {
        const lastUpdateTime = new Date(order.payment[0].lastUpdateTime);
        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - 3600000);
        const diff = oneHourAgo < lastUpdateTime;
        if (diff) return { 'message': 'You cannot delete an order item that is in process!', statusCode: 401, ok: false  };
      }
      const index = order.orderItems.map(item => item.toString()).indexOf(orderItemId);
      if (index == -1) return { 'message': 'Order item does not exist!', statusCode: 404, ok: false  };
      order.orderItems.splice(index, 1);
      // Delete the order item
      await OrderItem.findByIdAndDelete(orderItemId);
      // This save must be called to update the total Amount in the order
      await order.save();

      return { 'message': 'Order item was deleted successfully!', statusCode: 200, ok: true  };
    } catch (error) {
      myLogger.error('Error deleting order items: ' + error.message);
      return { 'message': 'An error occurred!', statusCode: 500, ok: false  };
    }
  },

  deleteOrder: async (_parent, { orderId }, { req }) => {
    // This endpoint will delete a order

     // authenticate user
     const response = await authRequest(req.headers.authorization);
     if (!response.ok) {
       const message = await response.json();
       return { statusCode: response.status, message: message.message, ok: response.ok };
     }
     const { user } = await response.json();

    try {
      const order = await Order.findById(orderId);
      if (!order) return { 'message': 'Order does not exist!', statusCode: 404, ok: false   };
      if (!(order.buyerId == user._id || order.sellerId == user._id)) return { 'message': 'You are not authorized to delete this order!', statusCode: 401, ok: false };
      if (order.payment && (order.payment[0].sellerPaymentStatus === 'paid' || order.payment[0].dispatcherPaymentStatus === 'paid')) return { 'message': 'You cannot delete a paid order!', statusCode: 401, ok: false };
      if (order.payment && (order.payment[0].sellerPaymentStatus === 'inprocess' || order.payment[0].dispatcherPaymentStatus === 'inprocess')) {
        const lastUpdateTime = new Date(order.payment[0].lastUpdateTime);
        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - 3600000);
        const diff = oneHourAgo < lastUpdateTime;
        if (diff) return { 'message': 'You cannot delete a order that is in process!', statusCode: 401, ok: false };
      }
      deleteOrderItems(order.orderItems);
      order.populate('payment');
      for (const payment of order.payment) {
        payment.isDeleted = true;
        payment.lastUpdateTime = new Date().toString();
        await payment.save();
      }

      await Order.findByIdAndDelete(orderId);
      return { 'message': 'Order was deleted successfully!', statusCode: 200, ok: true };
    } catch (error) {
      myLogger.error('Error deleting order: ' + error.message);
      return { 'message': 'An error occurred!', statusCode: 500, ok: false };
    }
  },

  updateOrderAddress: async (_parent, { orderId, deliveryAddress }, { req }) => {
    // This endpoint will update a order
    // Only the buyer should be able to update the delivery address

     // authenticate user
     const response = await authRequest(req.headers.authorization);
     if (!response.ok) {
       const message = await response.json();
       return { statusCode: response.status, message: message.message, ok: response.ok };
     }
     const { user } = await response.json();

    const order = await Order.findById(orderId);
    if (!order) return { 'message': 'Order does not exist!', statusCode: 404, ok: false };
    if (order.buyerId != user._id) return { 'message': 'You are not authorized to update this order!', statusCode: 401, ok: false };
    order.deliveryAddress = _.trim(deliveryAddress);
    await order.save();
    return { 'message': 'Order address was updated successfully!', 'id': orderId, statusCode: 200, ok: true };
  },

  deleteOrderItemsNow: async (_parent, { ids }, { req }) => {
    // This is an admin route or endpoint

     // authenticate user
     const response = await authRequest(req.headers.authorization);
     if (!response.ok) {
       const message = await response.json();
       return { statusCode: response.status, message: message.message, ok: response.ok };
     }
    deleteOrderItems(ids);
    return { 'message': 'Order items may have been deleted successfully!', statusCode: 200, ok: true };
  },

  createOrder: async (_parent, args, { req }) => {

    // authenticate user
    const response = await authRequest(req.headers.authorization);
    if (!response.ok) {
      const message = await response.json();
      return { statusCode: response.status, message: message.message, ok: response.ok };
    }
    const { user } = await response.json();

    const {
      sellerId,
      dispatcherId,
      deliveryAddress,
      orderItems,
    } = args;
    const buyerId = user._id;
    let createdItems = [];
    try {

      // Verify if the seller exist or not
      const seller = await User.findById(sellerId);
      if (!seller) return { 'message': 'seller does not exist!', statusCode: 404, ok: false };

      // Verify if the dispatcher exist or not and is available
      if (dispatcherId) {
        const dispatcher = await User.findById(dispatcherId);
        if (!dispatcher) return { 'message': 'dispatcher does not exist!', statusCode: 404, ok: false };
        if (dispatcher.dispatcherStatus !== 'available') return { 'message': 'Dispatcher is not available', statusCode: 401, ok: false };
      }
      let currency;
      let totalAmount = 0;
      // create each item one by one
      for (const data of orderItems) {
        // verify if the productId exist
        const product = await Product.findById(data.productId);
        if (!product) {
          deleteOrderItems(createdItems);
          return { 'message': 'Product does not exist!', statusCode: 404, ok: false  };
        }
        // get currency
        currency = product.currency;
        // calculate total amount
        if (!data.quantity) data.quantity = 1;
        totalAmount += product.price * data.quantity;
        
        const item = new OrderItem(data);
        await item.save();
        createdItems.push(item._id);
      }

      // create the order
      const newOrder = new Order({
        sellerId,
        dispatcherId,
        buyerId,
        deliveryAddress: _.trim(deliveryAddress),
        currency,
        totalAmount,
        orderItems: createdItems,
      });
      await newOrder.save();
      return { 'message': 'Order was created successfully!', 'id': newOrder._id, statusCode: 201, ok: true }
    } catch (error) {
      // Delete any created order items
      if (createdItems) deleteOrderItems(createdItems);
      myLogger.error('Error creating orders: ' + error.message);
      return { 'message': 'An error occurred!', statusCode: 500, ok: false };
    }
  },
}
