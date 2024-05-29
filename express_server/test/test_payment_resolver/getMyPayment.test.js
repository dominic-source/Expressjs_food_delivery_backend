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

  // Add more test cases here for different scenarios
});