import { myLogger } from '../utils/mylogger';
import Order from '../models/order';
import { OrderItem } from '../models/orderItem';
import { User } from '../models/user';
import { Product } from '../models/product'
import { deleteOrderItems } from '../utils/managedata/deletemodels';

export const ordersQueryResolver = {
  getAllOrders: async (_parent, _, { user }) => {
    return await Order.find();
  },
  getMyOrders: async (_parent, _, { user }) => {
    // This endpoint will get all the users orders as a buyer
    return await Order.find({
      buyerId: user.id,
    });
  },
  getMyOrderItems: async (_parent, { orderId }, { user }) => {
    // This endpoint will get all the order items of the users order
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
  },
  getTheOrderAsSeller: async (_parent, _, { user }) => { 
    // This endpoint retrieves a sellers order
    return await Order.find({
      sellerId: user.id,
    });
  },
  getTheOrderAsDispatcher: async (_parent, _, { user }) => {
  // This endpoint retrieves a dispatchers order
    return await Order.find({
      dispatcherId: user.id
    });
  }
}

export const ordersMutationResolver = {
  deleteOrderItemsNow: async (_parent, { ids }, { user }) => {
    deleteOrderItems(ids);
    return {'message': 'Order items may have been deleted successfully!'};
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
      if (!seller) return {'message': 'An error occurred!'};

      // Verify if the dispatcher exist or not and is available
      if (dispatcherId) {
        const dispatcher = await User.findById(dispatcherId);
        if (!dispatcher) return {'message': 'An error occurred!'};
        if (dispatcher.dispatcherStatus !== 'available') return {'message': 'Dispatcher is not available'};
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
        totalAmount += product.price;
        if (!product) {
          deleteOrderItems(createdItems);
          return {'message': 'Product does not exist!'};
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
      return {'message': 'Order was created successfully!'}
    } catch (error) {
      // Delete any created order items
      if (createdItems) deleteOrderItems(createdItems);
      myLogger.error('Error creating orders: ' + error.message);
      return {'message': 'An error occurred!'};
    }
  },

}
