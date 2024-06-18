import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { ordersMutationResolver } from '../../resolver/orders.resolver';
import { myLogger } from '../../utils/mylogger';
import { User } from '../../models/user';
import { OrderItem } from '../../models/orderItem';
import { Product } from '../../models/product';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('createOrder', function() {
  afterEach(function() {
    restore();
  });

  it('should create an order', async function() {
    const user = {
        id: new Types.ObjectId(),
        dispatcherStatus: 'available'
    };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const dispatcherId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const deliveryAddress = '123, Main Street';
    const product = {
      _id: new Types.ObjectId(),
      price: 100,
      currency: 'Naira',
    };
    const orderItems = [
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      },
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      }  
    ];
    const order = {
        sellerId,
        dispatcherId,
        deliveryAddress,
        orderItems: [orderItems],
        save: stub().resolves(),
    };

    const userStub = stub(User, 'findById').returns(user);
    const productStub = stub(Product, 'findById').returns(product);
    const orderItemStub = stub(OrderItem.prototype, 'save').resolves(orderItems);
    const orderStub = stub(Order.prototype, 'save').resolves(order);

    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.createOrder(
        null,
        { dispatcherId, sellerId, deliveryAddress, orderItems },
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
        });

    expect(result).to.have.property('message', 'Order was created successfully!');
    expect(result).to.have.property('id').to.be.a.string;
    expect(userStub.calledTwice).to.be.true;
    expect(orderItemStub.called).to.be.true;
    expect(orderStub.calledOnce).to.be.true;
    expect(productStub.called).to.be.true;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if the seller does not exist', async function() {
    const user = {
        id: new Types.ObjectId(),
        dispatcherStatus: 'available'
    };
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const dispatcherId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const deliveryAddress = '123, Main Street';
    const product = {
      _id: new Types.ObjectId(),
      price: 100,
      currency: 'Naira',
    };
    const orderItems = [
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      },
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      }  
    ];
    const order = {
        sellerId,
        dispatcherId,
        deliveryAddress,
        orderItems: [orderItems],
        save: stub().resolves(),
    };

    const userStub = stub(User, 'findById').returns(null);
    const productStub = stub(Product, 'findById').returns(product);
    const orderItemStub = stub(OrderItem.prototype, 'save').resolves(orderItems);
    const orderStub = stub(Order.prototype, 'save').resolves(order);

    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.createOrder(
        null,
        { dispatcherId, sellerId, deliveryAddress, orderItems },
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
    });
    expect(result).to.deep.equal({ 'message': 'seller does not exist!', statusCode: 404, ok: false });
    expect(userStub.calledOnce).to.be.true;
    expect(orderItemStub.called).to.be.false;
    expect(orderStub.called).to.be.false;
    expect(productStub.called).to.be.false;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if the product does not exist', async function() {
    const user = {
        id: new Types.ObjectId(),
        dispatcherStatus: 'available'
    };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const dispatcherId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const deliveryAddress = '123, Main Street';
    const product = {
      _id: new Types.ObjectId(),
      price: 100,
      currency: 'Naira',
    };
    const orderItems = [
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      },
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      }  
    ];

    const userStub = stub(User, 'findById').returns(user);
    const productStub = stub(Product, 'findById').returns(null);
    

    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.createOrder(
        null,
        { dispatcherId, sellerId, deliveryAddress, orderItems },
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         } });

    expect(result).to.have.property('message', 'Product does not exist!');
    expect(userStub.calledTwice).to.be.true;
    expect(productStub.called).to.be.true;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if the dispatcher does not exist', async function() {
    const user = {
        id: new Types.ObjectId(),
        dispatcherStatus: 'available'
    };
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const dispatcherId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const deliveryAddress = '123, Main Street';
    const product = {
      _id: new Types.ObjectId(),
      price: 100,
      currency: 'Naira',
    };
    const orderItems = [
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      },
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      }  
    ];
    const order = {
        sellerId,
        dispatcherId,
        deliveryAddress,
        orderItems: [orderItems],
        save: stub().resolves(),
    };

    const userStub = stub(User, 'findById').returns();
    const productStub = stub(Product, 'findById').returns(product);
    const orderItemStub = stub(OrderItem.prototype, 'save').resolves(orderItems);
    const orderStub = stub(Order.prototype, 'save').resolves(order);

    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.createOrder(
        null,
        { dispatcherId, sellerId, deliveryAddress, orderItems },
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
    });

    expect(result).to.deep.equal({ 'message': 'seller does not exist!', statusCode: 404, ok: false });
    expect(userStub.called).to.be.true;
    expect(orderItemStub.called).to.be.false;
    expect(orderStub.called).to.be.false;
    expect(productStub.called).to.be.false;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if the dispatcher is not available', async function() {
    const user = {
        id: new Types.ObjectId(),
        dispatcherStatus: 'busy'
    };

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });

    const dispatcherId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const deliveryAddress = '123, Main Street';
    const product = {
      _id: new Types.ObjectId(),
      price: 100,
      currency: 'Naira',
    };
    const orderItems = [
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      },
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      }  
    ];
    const order = {
        sellerId,
        dispatcherId,
        deliveryAddress,
        orderItems: [orderItems],
        save: stub().resolves(),
    };

    const userStub = stub(User, 'findById').returns(user);
    const productStub = stub(Product, 'findById').returns(product);
    const orderItemStub = stub(OrderItem.prototype, 'save').resolves(orderItems);
    const orderStub = stub(Order.prototype, 'save').resolves(order);

    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.createOrder(
        null,
        { dispatcherId, sellerId, deliveryAddress, orderItems },
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }});

    expect(result).to.have.property('message', 'Dispatcher is not available');
    expect(userStub.calledTwice).to.be.true;
    expect(orderItemStub.called).to.be.false;
    expect(orderStub.called).to.be.false;
    expect(productStub.called).to.be.false;
    expect(myLoggerError.called).to.be.false;
  });

  it('should return an error message if an error occurs', async function() {
    const user = {
        id: new Types.ObjectId(),
        dispatcherStatus: 'available'
    };
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: user.id
         }
      })
    });
  
    const dispatcherId = new Types.ObjectId();
    const sellerId = new Types.ObjectId();
    const deliveryAddress = '123, Main Street';
    const product = {
      _id: new Types.ObjectId(),
      price: 100,
      currency: 'Naira',
    };
    const orderItems = [
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      },
      {
        _id: new Types.ObjectId(),
        productId: product._id,
        quantity: 1,
        total: product.price,
        save: stub().resolves(),
      }  
    ];
    const order = {
        sellerId,
        dispatcherId,
        deliveryAddress,
        orderItems: [orderItems],
        save: stub().rejects(),
    };

    const userStub = stub(User, 'findById').returns(user);
    const productStub = stub(Product, 'findById').returns(product);
    const orderItemStub = stub(OrderItem.prototype, 'save').resolves(orderItems);
    const orderStub = stub(Order.prototype, 'save').rejects();

    const myLoggerError = stub(myLogger, 'error');
    const result = await ordersMutationResolver.createOrder(
        null,
        { dispatcherId, sellerId, deliveryAddress, orderItems },
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }});

    expect(result).to.have.property('message', 'An error occurred!');
    expect(userStub.calledTwice).to.be.true;
    expect(orderItemStub.called).to.be.true;
    expect(orderStub.calledOnce).to.be.true;
    expect(productStub.called).to.be.true;
    expect(myLoggerError.called).to.be.true;
  });
});
