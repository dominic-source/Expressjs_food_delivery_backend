import chai from 'chai';
import sinon from 'sinon';
import { Product } from '../../models/product';
import fetch from 'node-fetch';
import { productQueryResolver } from '../../resolver/products.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('getAllProducts', function() {
  afterEach(function() {
    restore();
  });

  it('should return all products', async function() {
    const products = [{
      _id: new Types.ObjectId(),
      name: 'Product 1',
      description: 'Product 1 description',
      price: 100,
      currency: 'Dollar',
      categoryId: new Types.ObjectId()
    }, {
      _id: new Types.ObjectId(),
      name: 'Product 2',
      description: 'Product 2 description',
      price: 200,
      currency: 'Dollar',
      categoryId: new Types.ObjectId()
    }];
    const findStub = stub(Product, 'find').resolves(products);
    const result = await productQueryResolver.getAllProducts(null);
    expect(result).to.be.deep.equal(products);
    expect(findStub.calledOnce).to.be.true;
  });
  
  it('should return null if an error occurs', async function() {
    const findStub = stub(Product, 'find').throws(new Error('Error occurred'));
    const result = await productQueryResolver.getAllProducts(null);
    expect(result).to.be.null;
    expect(findStub.calledOnce).to.be.true;
  });

  it('should return empty array if there are no products', async function() {
    const findStub = stub(Product, 'find').resolves([]);
    const result = await productQueryResolver.getAllProducts(null);
    expect(result).to.be.empty;
    expect(findStub.calledOnce).to.be.true;
  });

});