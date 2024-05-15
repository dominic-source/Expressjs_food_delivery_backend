import { myLogger } from '../mylogger';
import Order from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import { User } from '../../models/user';
import { Product } from '../../models/product'

export const deleteOrderItems = async (createdItem) => {
  for (const id of createdItem) {
    try {
      await OrderItem.findByIdAndDelete(id.toString());
    } catch (error) {
      myLogger.error(`Error deleting order item with id ${id}: ` + error.message);
    }
  }
}
