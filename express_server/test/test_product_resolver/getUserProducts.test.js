import chai from 'chai';
import sinon from 'sinon';
import { User } from '../../models/user';
import { productQueryResolver } from '../../resolver/products.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getUserProducts', function() {
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
    const result = await productQueryResolver.getUserProducts(null, null, { user });
    expect(result).to.be.deep.equal(user.products);
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
    const result = await productQueryResolver.getUserProducts(null, null, { user });
    expect(result).to.be.null;
    expect(findByIdStub.calledOnce).to.be.true;
  });

  it('should return null if user does not have products', async function() {
    const user = {
      id: new Types.ObjectId(),
      products: []
    };
    const findByIdStub = stub(User, 'findById').returns({ populate: stub().resolves(user) });
    const result = await productQueryResolver.getUserProducts(null, null, { user });
    expect(result).to.be.empty;
    expect(findByIdStub.calledOnce).to.be.true;
  });
});