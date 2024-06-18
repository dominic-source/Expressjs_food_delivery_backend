import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import Order from '../../models/order';
import { ordersQueryResolver } from '../../resolver/orders.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getMyOrders', function() {
  afterEach(function() {
    restore();
  });

  it('should get all orders where buyerId is equal to userId', async function() {
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
      },
      {
        id: '2',
        buyerId: '1',
        sellerId: '2',
        dispatcherId: '3',
        orderItems: ['1', '2'],
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
      const findStub = stub(Order, 'find').resolves(orders);
      const result = await ordersQueryResolver.getMyOrders(
        null,
        null,
        { req: {
          headers: {
           authorization: "fakeString"
          } 
         }
      });
      expect(result.statusCode).to.equal(200);
      expect(result.ok).to.be.true;
      expect(findStub.calledOnce).to.be.true;
  });

  it('should throw an error if an exception is raised', async function() {
    // const orderId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId,
         }
      })
    });

    stub(Order, 'find').throws(new Error('An error occurred'));

    const result = await ordersQueryResolver.getMyOrders(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       } 
    });
    expect(result.statusCode).to.equal(500);
    expect(result.message).to.equal('An error occurred!');
  });

  it('should throw an empty array if no order was found', async function(){
    const userId = new Types.ObjectId();
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId,
         }
      })
    });

    stub(Order, 'find').resolves([])
    const result = await ordersQueryResolver.getMyOrders(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });
    expect(result).to.deep.equal({ ordersData: [], statusCode: 200, ok: true });
  });
});
