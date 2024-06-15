import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Product } from '../../models/product';
import { productQueryResolver } from '../../resolver/products.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getProduct', function() {
  afterEach(function() {
    restore();
  });

  it('should return a product', async function() {
    const product = [{
      _id: new Types.ObjectId(),
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      currency: 'Dollar',
      categoryId: new Types.ObjectId()
    }];
    const findByIdStub = stub(Product, 'findById').resolves(product);

    const result = await productQueryResolver.getProduct(null, { id: product._id });
    expect(result).to.be.deep.equal(product);
    expect(findByIdStub.calledOnce).to.be.true;
  });
  it('should return null if product is not found', async function() {
    const product = [{
      _id: new Types.ObjectId(),
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      currency: 'Dollar',
      categoryId: new Types.ObjectId()
    }];
    const findByIdStub = stub(Product, 'findById').resolves(null);

    const result = await productQueryResolver.getProduct(null, { id: product._id });
    expect(result).to.be.null;
    expect(findByIdStub.calledOnce).to.be.true;
  });

  it('should return null if an error occurs', async function() {
    const product = [{
      _id: new Types.ObjectId(),
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      currency: 'Dollar',
      categoryId: new Types.ObjectId()
    }];
    const findByIdStub = stub(Product, 'findById').throws(new Error('Error'));

    const result = await productQueryResolver.getProduct(null, { id: product._id });
    expect(result).to.be.null;
    expect(findByIdStub.calledOnce).to.be.true;
  });

  it('should return null if an exception occurs', async function() {
    const product = [{
      _id: new Types.ObjectId(),
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      currency: 'Dollar',
      categoryId: new Types.ObjectId()
    }];
    const findByIdStub = stub(Product, 'findById').throws(new Error('Error'));

    const result = await productQueryResolver.getProduct(null, { id: product._id });
    expect(result).to.be.null;
    expect(findByIdStub.calledOnce).to.be.true;
  });
});