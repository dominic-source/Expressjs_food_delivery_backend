import chai from 'chai';
import { restore, stub } from 'sinon';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { Payment } from '../../models/payment';
import { paymentMutationResolver } from '../../resolver/payment.resolver';


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

    // Stubbing Payment constructor to return the payment instance
    const paymentStub = stub(Payment.prototype, 'save').resolves(payment);
    const result = await paymentMutationResolver.createPayment(
        null, 
        { orderId, paymentMethod, currency, sellerAmount, dispatcherAmount }, 
        { user: {
             id: userId.toString() 
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
  // Add more test cases here for different scenarios
});
