import chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import Order from '../../models/order';
import { paymentQueryResolver } from '../../resolver/payment.resolver';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getMyPayment', function() {
  afterEach(function() {
    restore();
  });

  it('should return payment when order exists and user is buyer, seller, or dispatcher', async function() {
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const payment = { amount: 100 };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId
         }
      })
    });

    const order = {
      _id: orderId,
      buyerId: userId,
      sellerId: userId,
      dispatcherId: userId,
      payment: payment,
    };

    stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });

    const result = await paymentQueryResolver.getMyPayment(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });
    const expected = { paymentsData: payment, statusCode: 200, ok: true };
    expect(result).to.deep.equal(expected);
  });

  it('should return an error when order does not exist', async function() {
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId
         }
      })
    });

    stub(Order, 'findById').resolves(null);

    const result = await paymentQueryResolver.getMyPayment(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.deep.equal({ 'message': 'An error occurred!', statusCode: 500, ok: false });
  });

  it('should return an error when user is not buyer, seller, or dispatcher', async function() { 
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId
         }
      })
    });

    const order = {
      _id: orderId,
      buyerId: otherUserId,
      sellerId: otherUserId,
      dispatcherId: otherUserId,
    };

    stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });

    const result = await paymentQueryResolver.getMyPayment(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result).to.deep.equal({ message: 'You are may not be the right user!', statusCode: 401, ok: false });
  });

  it('should throw an error if an exception occurs', async function() {
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId
         }
      })
    });

    stub(Order, 'findById').throws(new Error('An error occurred'));

    const result = await paymentQueryResolver.getMyPayment(
      null,
      { orderId },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });
    expect(result).to.deep.equal({ 'message': 'An error occurred!', statusCode: 500, ok: false });
  });
});