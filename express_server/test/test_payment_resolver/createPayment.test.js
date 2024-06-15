import chai from 'chai';
import { restore, stub } from 'sinon';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { Payment } from '../../models/payment';
import { paymentMutationResolver } from '../../resolver/payment.resolver';
import fetch from 'node-fetch';

const { expect } = chai;
describe('createPayment', function() {
  afterEach(function() {
    restore();
  });

  it('should create a payment when order exists and user is buyer', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'Naira';
    const sellerAmount = 100;
    const dispatcherAmount = 50;

    const order = {
      _id: orderId,
      buyerId: userId,
      payment: [],
      save: stub().resolves()
    };


    const paymentId = new Types.ObjectId();
    const payment = {
        _id: paymentId,
        orderId,
        paymentMethod,
        currency,
        sellerAmount,
        dispatcherAmount,
      };

    // Stubbing Order.findById to resolve with the order
    stub(Order, 'findById').resolves(order);
    
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId
         }
      })
    });
    // Stubbing Payment constructor to return the payment instance
    const paymentStub = stub(Payment.prototype, 'save').resolves(payment);
    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { req: {
             headers: {
              authorization: "fakeString"
             } 
            } 
        });
    // Check if the result has the correct message and an id field
    expect(result).to.have.property('message', 'Payment was successfully created!');
    expect(result).to.have.property('id').that.is.a('string');
        
    // Ensure the save methods were called
    expect(order.save.calledOnce).to.be.true;

    // Restore the constructor stub
    paymentStub.restore();
  });

  it('should throw an error when order does not exist', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'Naira';
    const sellerAmount = 100;
    const dispatcherAmount = 50;

    // Stubbing Order.findById to resolve with null
    stub(Order, 'findById').resolves(null);

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'Order not found');
  });

  it('should throw an error when user is not buyer', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'Naira';
    const sellerAmount = 100;
    const dispatcherAmount = 50;

    const order = {
      _id: orderId,
      buyerId: new Types.ObjectId(),
      payment: [],
      save: stub().resolves()
    };

    // Stubbing Order.findById to resolve with the order
    stub(Order, 'findById').resolves(order);

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'Unauthorized');
  });

  it('should throw an error when payment method is invalid', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'invalid';
    const currency = 'Naira';
    const sellerAmount = 100;
    const dispatcherAmount = 50;

    const order = {
      _id: orderId,
      buyerId: userId,
      payment: [],
      save: stub().resolves()
    };

    // Stubbing Order.findById to resolve with the order
    stub(Order, 'findById').resolves(order);

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'payment method is not allowed');
  });

  it('should throw an error when currency is invalid', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'invalid';
    const sellerAmount = 100;
    const dispatcherAmount = 50;

    const order = {
      _id: orderId,
      buyerId: userId,
      payment: [],
      save: stub().resolves()
    };

    // Stubbing Order.findById to resolve with the order
    stub(Order, 'findById').resolves(order);

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'currency not available for transaction');
  });

  it('should throw an error when seller amount is invalid', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'Naira';
    const sellerAmount = -100;
    const dispatcherAmount = 50;

    const order = {
      _id: orderId,
      buyerId: userId,
      payment: [],
      save: stub().resolves()
    };

    // Stubbing Order.findById to resolve with the order
    stub(Order, 'findById').resolves(order);

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'Invalid amount');
  });

  it('should throw an error when dispatcher amount is invalid', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'Naira';
    const sellerAmount = 100;
    const dispatcherAmount = -50;

    const order = {
      _id: orderId,
      buyerId: userId,
      payment: [],
      save: stub().resolves()
    };

    // Stubbing Order.findById to resolve with the order
    stub(Order, 'findById').resolves(order);

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'Invalid amount');
  });

  it('should return an error when an exception occurs', async function() {
    const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();
    const paymentMethod = 'cash';
    const currency = 'Naira';
    const sellerAmount = 100;
    const dispatcherAmount = 50;

    // Stubbing Order.findById to throw an error
    stub(Order, 'findById').throws(new Error('error'));

    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
            } 
        });
    // Check if the result has the correct message
    expect(result).to.have.property('message', 'An error occurred while processing payment');
  });
});
