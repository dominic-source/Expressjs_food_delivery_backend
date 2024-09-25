import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { ordersMutationResolver } from '../../resolver/orders.resolver';
import { myLogger } from '../../utils/mylogger';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('deleteOrder', function() {
  afterEach(function() {
    restore();
  });

  it('should successfully delete an order', async function() {
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
      populate: stub().returnsThis(),
      payment: [{
        sellerPaymentStatus: 'unpaid',
        dispatcherPaymentStatus: 'unpaid',
        save: stub().resolves(),
    }],
      orderItems: [],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);
    const myLoggerError = stub(myLogger, 'error');
    const deleteOrderItems = stub(Order, 'findByIdAndDelete').returns();
    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order was deleted successfully!');
    expect(deleteOrderItems.calledOnce).to.be.true;
    expect(orderFindById.calledOnce).to.be.true;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if order does not exist', async function() {
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

    const orderFindById = stub(Order, 'findById').returns(null);

    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order does not exist!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if user is not authorized to delete the order', async function() {
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

    const orderFindById = stub(Order, 'findById').returns({
        populate: stub().resolves(null),
    });

    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'You are not authorized to delete this order!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if order is paid', async function() {
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
      populate: stub().returnsThis(),
      payment: [{
        sellerPaymentStatus: 'paid',
        dispatcherPaymentStatus: 'paid',
        save: stub().resolves(),
    }],
      orderItems: [],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);

    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'You cannot delete a paid order!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should not return an error message if order status is inprocess and lastupdate time is more than 1hr', async function() {
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
      populate: stub().returnsThis(),
      payment: [{
        sellerPaymentStatus: 'inprocess',
        dispatcherPaymentStatus: 'inprocess',
        lastUpdateTime: new Date(new Date().getTime() - 7200000).toString(),
        save: stub().resolves(),
    }],
      orderItems: [],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);
    const findByIdAndDelete = stub(Order, 'findByIdAndDelete').resolves();

    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order was deleted successfully!');
    expect(orderFindById.calledOnce).to.be.true;
    expect(findByIdAndDelete.calledOnce).to.be.true;
  });

  it('should return error message if order status is inprocess and lastupdate time is less than 1hr', async function() {
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
      populate: stub().returnsThis(),
      payment: [{
        sellerPaymentStatus: 'inprocess',
        dispatcherPaymentStatus: 'inprocess',
        lastUpdateTime: new Date(new Date().getTime() - 3000000).toString(),
        save: stub().resolves(),
    }],
      orderItems: [],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);

    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'You cannot delete a order that is in process!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should return an error message if an exception is thrown', async function() {
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

    const orderFindById = stub(Order, 'findById').throws();

    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'An error occurred!');
    expect(orderFindById.calledOnce).to.be.true;
  });

  it('should update the payment status to isDeleted', async function() {
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
      populate: stub().returnsThis(),
      payment: [{
        sellerPaymentStatus: 'unpaid',
        dispatcherPaymentStatus: 'unpaid',
        save: stub().resolves(),
    }],
      orderItems: [],
      save: stub().resolves(),
    };

    const orderFindById = stub(Order, 'findById').returns(order);
    const deleteOrderItems = stub(Order, 'findByIdAndDelete').returns();
    const result = await ordersMutationResolver.deleteOrder(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.have.property('message', 'Order was deleted successfully!');
    expect(deleteOrderItems.calledOnce).to.be.true;
    expect(orderFindById.calledOnce).to.be.true;
    expect(order.payment[0].isDeleted).to.be.true;
  });
});