import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import Order from '../../models/order';
import { ordersQueryResolver } from '../../resolver/orders.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getMyOrderitems', function() {
  afterEach(function() {
    restore();
  });

  it('should get all orders where sellerId is equal to userId', async function() {
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
        },
        {
          id: '2',
          buyerId: '1',
          sellerId: '2',
          dispatcherId: '3',
          orderItems: ['1', '2'],
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const findStub = stub(Order, 'find').resolves(orders);
      const result = await ordersQueryResolver.getTheOrderAsSeller(
        null,
        null,
        {
            user: { id: new Types.ObjectId() }
        }
      )
      expect(result).to.be.deep.equal(orders);
      expect(findStub.calledOnce).to.be.true;
  });

  it('should throw an error if an exception is raised', async function() {
    // const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    stub(Order, 'find').throws(new Error('An error occurred'));

    const result = await ordersQueryResolver.getTheOrderAsSeller(null, null, { user: { id: userId.toString() } });
    expect(result).to.deep.equal([]);
  });

  it('should throw an empty array if no order was found', async function(){
    const userId = new Types.ObjectId();
    stub(Order, 'find').resolves([])
    const result = await ordersQueryResolver.getTheOrderAsSeller(null, null, { user: { id: userId.toString() } });
    expect(result).to.deep.equal([]);
  });


});