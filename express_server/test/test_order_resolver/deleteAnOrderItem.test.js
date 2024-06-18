import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import { ordersMutationResolver } from '../../resolver/orders.resolver';
import { myLogger } from '../../utils/mylogger';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('deleteAnOrderItem', function() {
  afterEach(function() {
    restore();
  });

  it('should successfully delete an order item', async function() {
    const orderId = new Types.ObjectId();
    const orderItemId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const order = {
      buyerId: user.id,
      sellerId: user.id,
      populate: stub().returnsThis(),
      payment: [{ sellerPaymentStatus: 'unpaid', dispatcherPaymentStatus: 'unpaid' }],
      orderItems: [orderItemId],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);
    const myLoggerError = stub(myLogger, 'error');
    const findByIdAndDelete = stub(OrderItem, 'findByIdAndDelete').returns();
    const orderItemIdString = orderItemId.toString();
    const result = await ordersMutationResolver.deleteAnOrderItem(
      null, 
      { orderId, orderItemId: orderItemIdString },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order item was deleted successfully!');
    expect(findByIdAndDelete.calledOnce).to.be.true;
    expect(orderFindById.calledOnce).to.be.true;
    expect(order.save.calledOnce).to.be.true;
    expect(myLoggerError.called).to.be.false;

    expect(order.orderItems).to.not.include(orderItemId);
  });

  it('should return an error message if order does not exist', async function() {
    const orderId = new Types.ObjectId();
    const orderItemId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const orderFindById = stub(Order, 'findById').returns({
        populate: stub().resolves(null),
    });

    const result = await ordersMutationResolver.deleteAnOrderItem(
      null,
      { orderId, orderItemId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order does not exist!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if user is not authorized to delete the order item', async function() {
    const orderId = new Types.ObjectId();
    const orderItemId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });
  
    const order = {
      buyerId: new Types.ObjectId(),
      sellerId: new Types.ObjectId(),
      populate: stub().returnsThis(),
      payment: [{ sellerPaymentStatus: 'unpaid', dispatcherPaymentStatus: 'unpaid' }],
      orderItems: [orderItemId],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);
    const result = await ordersMutationResolver.deleteAnOrderItem(
      null,
      { orderId, orderItemId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'You are not authorized to delete this order item!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if order status is inprocess and lastupdate time is not less than 1hr', async function() {
    const orderId = new Types.ObjectId();
    const orderItemId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const order = {
      buyerId: user.id,
      sellerId: user.id,
      payment: [{
        sellerPaymentStatus: 'inprocess',
        dispatcherPaymentStatus: 'inprocess',
        lastUpdateTime: new Date(new Date().getTime() - 3000000).toString() }],
      orderItems: [orderItemId],
      save: stub().resolves(),
    };
    const orderFindById = stub(Order, 'findById').returns({ 
      populate: stub().resolves(order) 
    });

    const result = await ordersMutationResolver.deleteAnOrderItem(
      null,
      { orderId, orderItemId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'You cannot delete an order item that is in process!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should not return an error message if order status is inprocess and lastupdate time is more than 1hr', async function() {
    const orderId = new Types.ObjectId();
    const orderItemId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });
    const order = {
      buyerId: user.id,
      sellerId: user.id,
      payment: [{
        sellerPaymentStatus: 'inprocess',
        dispatcherPaymentStatus: 'inprocess',
        lastUpdateTime: new Date(new Date().getTime() - 7200000).toString()
      }],
      orderItems: [orderItemId],
      save: stub().resolves(),
    };
    const orderFindById = stub(Order, 'findById').returns({ 
      populate: stub().resolves(order) 
    });
    const findByIdAndDelete = stub(OrderItem, 'findByIdAndDelete').returns();
    const orderItemIdString = orderItemId.toString();
    const result = await ordersMutationResolver.deleteAnOrderItem(
      null,
      { orderId, orderItemId: orderItemIdString },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order item was deleted successfully!');
    expect(orderFindById.calledOnce).to.be.true;
    expect(findByIdAndDelete.calledOnce).to.be.true;
  });

  it('should return an error message if order item does not exist', async function() {
    const orderId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const order = {
      buyerId: user.id,
      sellerId: user.id,
      payment: [{ sellerPaymentStatus: 'unpaid', dispatcherPaymentStatus: 'unpaid' }],
      orderItems: [],
      save: stub().resolves(),
    };
    const orderFindById = stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });
    const result = await ordersMutationResolver.deleteAnOrderItem(
      null,
      { orderId, orderItemId: order.orderItems },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order item does not exist!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if an exception is thrown', async function() {
    const orderId = new Types.ObjectId();
    const orderItemId = new Types.ObjectId();
    const user = { id: new Types.ObjectId() };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const orderFindById = stub(Order, 'findById').throws();
    const result = await ordersMutationResolver.deleteAnOrderItem(
      null,
      { orderId, orderItemId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'An error occurred!');
    expect(orderFindById.calledOnce).to.be.true;
  });
});
