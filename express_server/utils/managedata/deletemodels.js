import { myLogger } from '../mylogger';
import { OrderItem } from '../../models/orderItem';

export const deleteOrderItems = async (createdItem) => {
  for (const id of createdItem) {
    try {
      await OrderItem.findByIdAndDelete(id.toString());
    } catch (error) {
      myLogger.error(`Error deleting order item with id ${id}: ` + error.message);
    }
  }
}
