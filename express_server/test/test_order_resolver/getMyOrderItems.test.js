import chai from 'chai';
import sinon from 'sinon';
import Order from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import { ordersQueryResolver } from '../../resolver/orders.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getMyOrderitems', function() {
  afterEach(function() {
    restore();
  });

  it('should get all items of an order', async function() {
    const orders = [
        {
          id: '1',
          buyerId: '1',
          sellerId: '2',
          dispatcherId: '3',
          orderItems: ['1', '2'],
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
    ];
    const items = [
        {
          productId: '1',
          quantity: 100
        }
    ];
    const stubFind = stub(Order, 'find').resolves(orders);

    const stubFindItems = stub(OrderItem, 'find').resolves(items);

    const result = await ordersQueryResolver.getMyOrderItems(
        null,
        { orderId: new Types.ObjectId()},
        {
            user: { id: new Types.ObjectId() }
        }
      );
    
    expect(stubFindItems.calledOnce).to.be.true;
    expect(stubFind.calledOnce).to.be.true;
    expect(result).to.be.deep.equal(items);
  });
});