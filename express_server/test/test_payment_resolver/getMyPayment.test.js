import chai from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
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

    const result = await paymentQueryResolver.getMyPayment(null, { orderId }, { user: { id: userId.toString() } });

    expect(result).to.deep.equal(payment);
  });

  it('should return an error when order does not exist', async function() {
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    stub(Order, 'findById').resolves(null);

    const result = await paymentQueryResolver.getMyPayment(null, { orderId }, { user: { id: userId.toString() } });

    expect(result).to.deep.equal([]);
  });

  it('should return an error when user is not buyer, seller, or dispatcher', async function() { 
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const order = {
      _id: orderId,
      buyerId: otherUserId,
      sellerId: otherUserId,
      dispatcherId: otherUserId,
    };

    stub(Order, 'findById').returns({
      populate: stub().resolves(order),
    });

    const result = await paymentQueryResolver.getMyPayment(null, { orderId }, { user: { id: userId.toString() } });

    expect(result).to.deep.equal([]);
  });

  it('should throw an error if an exception occurs', async function() {
    const orderId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    stub(Order, 'findById').throws(new Error('An error occurred'));

    const result = await paymentQueryResolver.getMyPayment(null, { orderId }, { user: { id: userId.toString() } });
    expect(result).to.deep.equal([]);
  });
});