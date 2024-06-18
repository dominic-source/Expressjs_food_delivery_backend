import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import Order from '../../models/order';
import { OrderItem } from '../../models/orderItem';
import { ordersQueryResolver } from '../../resolver/orders.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getMyOrderitems', function() {
  afterEach(function() {
    restore();
  });

  it('should get all items of an order', async function() {
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: new Types.ObjectId(),
         }
      })
    });

    const orders = [
      {
        id: '1',
        buyerId: '1',
        sellerId: '2',
        dispatcherId: '3',
        orderItems: ['1', '2'],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    const items = [
        {
          productId: '1',
          quantity: 100
        }
    ];
    const stubFind = stub(Order, 'find').resolves(orders);

    const stubFindItems = stub(OrderItem, 'find').resolves(items);

    const result = await ordersQueryResolver.getMyOrderItems(
        null,
        { orderId: new Types.ObjectId()},
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
        }
      );
    
    expect(stubFindItems.calledOnce).to.be.true;
    expect(stubFind.calledOnce).to.be.true;
    expect(result.statusCode).to.equal(200);
    expect(result.ok).to.be.true;
  });

  it('should return an empty array if order is not found', async function() {
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: new Types.ObjectId(),
         }
      })
    });

    const stubFind = stub(Order, 'find').resolves([]);

    const result = await ordersQueryResolver.getMyOrderItems(
        null,
        { orderId: new Types.ObjectId()},
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
        });
    expect(result.statusCode).to.equal(500)
    expect(stubFind.calledOnce).to.be.true;
  });

  it('should return an empty array if an exception is thrown', async function(){
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: new Types.ObjectId(),
         }
      })
    });

    const stubFind = stub(Order, 'find').throws(new Error('An exception occurred!'))
    const result = await ordersQueryResolver.getMyOrderItems(
      null,
      { orderId: new Types.ObjectId()},
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      }
    );
  
    expect(stubFind.calledOnce).to.be.true;
    expect(result.statusCode).to.equal(500);
  });

  it('should return an empty array if an exception is thrown in orderitem', async function(){
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: new Types.ObjectId(),
         }
      })
    });

    const orders = [
      {
        id: '1',
        buyerId: '1',
        sellerId: '2',
        dispatcherId: '3',
        orderItems: ['1', '2'],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    const items = [
        {
          productId: '1',
          quantity: 100
        }
    ];
    const stubFind = stub(Order, 'find').resolves(orders);

    const stubFindItems = stub(OrderItem, 'find').throws(new Error());

    const result = await ordersQueryResolver.getMyOrderItems(
        null,
        { orderId: new Types.ObjectId()},
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
        }
      );
    
    expect(stubFindItems.calledOnce).to.be.true;
    expect(stubFind.calledOnce).to.be.true;
    expect(result.statusCode).to.equal(500);
    expect(result.ok).to.be.false;
  });
});