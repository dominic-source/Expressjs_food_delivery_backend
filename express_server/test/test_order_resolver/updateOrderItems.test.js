import chai from 'chai';
import sinon from 'sinon';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import { ordersMutationResolver } from '../../resolver/orders.resolver';
import { myLogger } from '../../utils/mylogger';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('updateOrderItems', function() {
  afterEach(function() {
    restore();
  });

  it('should successfully update orderItems', async function() {
    const itemId1 = new Types.ObjectId();
    const itemId2 = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const dispatcherId = new Types.ObjectId();
    const buyerId = new Types.ObjectId();
    const orderId = new Types.ObjectId();

    const orderItems = [
        {
          id: itemId1,
          orderId: orderId,
          productId: new Types.ObjectId(),
          quantity: 20,
          save: stub().resolves(),
        },
        {
          id: itemId2,
          orderId: orderId,
          productId: new Types.ObjectId(),
          quantity: 10,
          save: stub().resolves(),
        },
      ];

    const order = {
        id: orderId,
        buyerId,
        sellerId,
        dispatcherId,
        orderItems: [itemId1, itemId2],
        payment: [{ dispatcherPaymentStatus: 'unpaid', sellerPaymentStatus: 'unpaid' }],
        save: stub().resolves(),
    }
    const orderStub = stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });
    const findStub = stub(OrderItem, 'findById').resolves(orderItems[0]);
    const result = await ordersMutationResolver.updateOrderItems(
      null,
      { orderId, orderItems },
      { user: { id: buyerId } }
    );
    expect(result).to.have.property('message', 'Order items were updated successfully!');
    expect(result).to.have.property('id').to.be.a.string;
    expect(findStub.called).to.be.true;
    expect(orderStub.calledOnce).to.be.true;
  });

  it('should return an error message if order does not exist', async function() {
    const orderId = new Types.ObjectId();
    const buyerId = new Types.ObjectId();
    const orderStub = stub(Order, 'findById').returns({
      populate: stub().resolves(null),
    });
    const result = await ordersMutationResolver.updateOrderItems(
    null,
    { orderId },
    { user: { id: buyerId } }
    );
    expect(result).to.have.property('message', 'Order does not exist!');
    expect(orderStub.calledOnce).to.be.true;
  });

  it('should return an error message if user is not authorized', async function() {
    const orderId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const dispatcherId = new Types.ObjectId();
    const buyerId = new Types.ObjectId();
    const order = {
        id: orderId,
        buyerId,
        sellerId,
        dispatcherId,
        orderItems: [new Types.ObjectId()],
        payment: [{ dispatcherPaymentStatus: 'unpaid', sellerPaymentStatus: 'unpaid' }],
        save: stub().resolves(),
    }
    const orderStub = stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });
    const result = await ordersMutationResolver.updateOrderItems(
    null,
    { orderId },
    { user: { id: new Types.ObjectId() } }
    );
    expect(result).to.have.property('message', 'You are not authorized to update this order item!');
    expect(orderStub.calledOnce).to.be.true;
  });

  it('should return an error message if order is paid', async function() {
    const orderId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const dispatcherId = new Types.ObjectId();
    const buyerId = new Types.ObjectId();
    const order = {
        id: orderId,
        buyerId,
        sellerId,
        dispatcherId,
        orderItems: [new Types.ObjectId()],
        payment: [{ dispatcherPaymentStatus: 'paid', sellerPaymentStatus: 'paid' }],
        save: stub().resolves(),
    }
    const orderStub = stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });
    const result = await ordersMutationResolver.updateOrderItems(
    null,
    { orderId },
    { user: { id: buyerId } }
    );
    expect(result).to.have.property('message', 'You cannot update a paid orders item!');
    expect(orderStub.calledOnce).to.be.true;
 });

  it('should return an error message if orderItems is not provided', async function() {
    const orderId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const dispatcherId = new Types.ObjectId();
    const buyerId = new Types.ObjectId();
    const order = {
        id: orderId,
        buyerId,
        sellerId,
        dispatcherId,
        orderItems: [new Types.ObjectId()],
        payment: [{ dispatcherPaymentStatus: 'unpaid', sellerPaymentStatus: 'unpaid' }],
        save: stub().resolves(),
    }
    const orderStub = stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });
    const result = await ordersMutationResolver.updateOrderItems(
    null,
    { orderId },
    { user: { id: buyerId } }
    );
    expect(result).to.have.property('message', 'Order items must be provided!');
    expect(orderStub.calledOnce).to.be.true;
  });

  it('should return an error message if orderItems is not an array', async function() {
    const orderId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const dispatcherId = new Types.ObjectId();
    const buyerId = new Types.ObjectId();

    const order = {
        id: orderId,
        buyerId,
        sellerId,
        dispatcherId,
        orderItems: [new Types.ObjectId()],
        payment: [{ sellerPaymentStatus: 'unpaid', dispatcherPaymentStatus: 'unpaid' }],
        save: stub().resolves(),
    }
    const orderStub = stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });
    const result = await ordersMutationResolver.updateOrderItems(
    null,
    { orderId, orderItems: {} },
    { user: { id: buyerId } }
    );
    expect(result).to.have.property('message', 'Order items must be an array!');
    expect(orderStub.calledOnce).to.be.true;
  });

  it('should return an error when an exception is raised', async function() {
    const orderStub = stub(Order, 'findById').throws(new Error('error occurred'));
    const buyerId = new Types.ObjectId();
    const result = await ordersMutationResolver.updateOrderItems(
    null,
    { orderId: new Types.ObjectId() },
    { user: { id: buyerId } }
    );
    expect(result).to.have.property('message', 'An error occurred!');
    expect(orderStub.calledOnce).to.be.true;    
  });
});