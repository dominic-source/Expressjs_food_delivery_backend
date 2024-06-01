import chai from 'chai';
import sinon from 'sinon';
import Order from '../../models/order';
import { ordersQueryResolver } from '../../resolver/orders.resolver';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getAllOrders', function() {
  afterEach(function() {
    restore();
  });

  it('should return all orders', async function() {
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
    const result = await ordersQueryResolver.getAllOrders();
    expect(result).to.deep.equal(orders);
    expect(findStub.calledOnce).to.be.true;
  });

  it('should return empty array if there are no orders', async function() {
    const findStub = stub(Order, 'find').resolves([]);
    const result = await ordersQueryResolver.getAllOrders();
    expect(result).to.deep.equal([]);
    expect(findStub.calledOnce).to.be.true;
  });

  it('should return empty array if there is an error', async function() {
    const findStub = stub(Order, 'find').rejects(new Error('error'));
    const result = await ordersQueryResolver.getAllOrders();
    expect(result).to.deep.equal([]);
    expect(findStub.calledOnce).to.be.true;
  });
});