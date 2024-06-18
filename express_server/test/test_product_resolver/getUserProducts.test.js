import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { User } from '../../models/user';
import { productQueryResolver } from '../../resolver/products.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getUserProducts', function() {
  beforeEach(function() {
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: new Types.ObjectId(),
        },
        isAdmin: true
      }),
      status: 200
    });
  });

  afterEach(function() {
    restore();
  });

  it('should return a user products', async function() {
    const user = {
      id: new Types.ObjectId(),
      products: [{
        _id: new Types.ObjectId(),
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        currency: 'Dollar',
        categoryId: new Types.ObjectId()
      }]
    };
    const findByIdStub = stub(User, 'findById').returns({ populate: stub().resolves(user) });
    const result = await productQueryResolver.getUserProducts(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });

    expect(result.statusCode).to.equal(200);
    expect(findByIdStub.calledOnce).to.be.true;
  });

  it('should return null if an error occurs', async function() {
    const user = {
      id: new Types.ObjectId(),
      products: [{
        _id: new Types.ObjectId(),
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        currency: 'Dollar',
        categoryId: new Types.ObjectId()
      }]
    };
    const findByIdStub = stub(User, 'findById').throws(new Error('Error occurred'));
    const result = await productQueryResolver.getUserProducts(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });
    expect(result).to.deep.equal({ message: 'An error occured!', statusCode: 500, ok: false });
    expect(findByIdStub.calledOnce).to.be.true;
  });

  it('should return null if user does not have products', async function() {
    const user = {
      id: new Types.ObjectId(),
      products: []
    };
    const findByIdStub = stub(User, 'findById').returns({ populate: stub().resolves(user) });
    const result = await productQueryResolver.getUserProducts(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });
    expect(result.productsData).to.be.empty;
    expect(findByIdStub.calledOnce).to.be.true;
  });
});
