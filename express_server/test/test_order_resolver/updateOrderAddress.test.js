import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { ordersMutationResolver } from '../../resolver/orders.resolver';
import { myLogger } from '../../utils/mylogger';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('updateOrderAddress', function() {
  afterEach(function() {
    restore();
  });

  it('should update the address of an order', async function() {
    const orderId = new Types.ObjectId().toString();
    const user = { id: new Types.ObjectId() };

    const order = {
      id: orderId,
      buyerId: user.id,
      deliveryAddress: 'old address',
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);
    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.updateOrderAddress(null, { orderId }, { user });

    expect(result).to.have.property('message', 'Order address was updated successfully!');
    expect(result).to.have.property('id').to.be.a.string;
    expect(orderFindById.calledOnce).to.be.true;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if order does not exist', async function() {
    const orderId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    const orderFindById = stub(Order, 'findById').returns(null);

    const result = await ordersMutationResolver.updateOrderAddress(null, { orderId }, { user });

    expect(result).to.have.property('message', 'Order does not exist!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if user is not authorized to update the order', async function() {
    const orderId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    const order = {
      buyerId: new Types.ObjectId(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);

    const result = await ordersMutationResolver.updateOrderAddress(null, { orderId }, { user });

    expect(result).to.have.property('message', 'You are not authorized to update this order!');
    expect(orderFindById.calledOnce).to.be.true;
  });
});