import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Product } from '../../models/product';
import Category from '../../models/category';
import { User } from '../../models/user';
import { productMutationResolver } from '../../resolver/products.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('updateProduct', function() {
  afterEach(function() {
    restore();
  });

  it('should update a product', async function() {
    const productId = new Types.ObjectId();
    const categoryId = new Types.ObjectId();
    const product = {
      id: productId,
      name: 'product1',
      description: 'description1',
      price: 100,
      currency: 'Naira',
      categoryId
    };
    const category = {
        id: categoryId,
        name: 'category1'
        };
    const user = {
      id: new Types.ObjectId(),
      products: [productId],
      populate: stub().returnsThis()
    };
    
    const findByIdAndUpdateStub = stub(Product, 'findByIdAndUpdate').resolves(product);
    const findByIdUserStub = stub(User, 'findById').returns(user);
    
    const categoryStub = stub(Category, 'findById').returns(category);
    const id = productId.toString();
    const result = await productMutationResolver.updateProduct(null, { id, product, categoryId}, { user });

    expect(result.name).to.deep.equal(product.name);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
    expect(categoryStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
  });

  it('should throw an error if the product is not found', async function() {
    const productId = new Types.ObjectId();
    const categoryId = new Types.ObjectId();
    const product = {
      id: productId,
      name: 'product1',
      description: 'description1',
      price: 100,
      currency: 'Naira',
      categoryId
    };
    const category = {
        id: categoryId,
        name: 'category1'
        };
    const user = {
      id: new Types.ObjectId(),
      products: [productId],
      populate: stub().returnsThis()
    };
    
    const findByIdAndUpdateStub = stub(Product, 'findByIdAndUpdate').resolves(null);
    const findByIdUserStub = stub(User, 'findById').returns(user);
    
    const categoryStub = stub(Category, 'findById').returns(category);
    const id = productId.toString();
    const result = await productMutationResolver.updateProduct(null, { id, product, categoryId}, { user });

    expect(result).to.deep.equal({ 'message': 'An error occured!' });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
    expect(categoryStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
  });

  it('should return an error if category is not found', async function() {
    const productId = new Types.ObjectId();
    const categoryId = new Types.ObjectId();
    const product = {
      id: productId,
      name: 'product1',
      description: 'description1',
      price: 100,
      currency: 'Naira',
      categoryId
    };
    const user = {
      id: new Types.ObjectId(),
      products: [productId],
      populate: stub().returnsThis()
    };
    
    const findByIdAndUpdateStub = stub(Product, 'findByIdAndUpdate').resolves(product);
    const findByIdUserStub = stub(User, 'findById').returns(user);
    
    const categoryStub = stub(Category, 'findById').returns(null);
    const id = productId.toString();
    const result = await productMutationResolver.updateProduct(null, { id, product, categoryId}, { user });

    expect(result).to.deep.equal({'message': 'This category does not exist!'});
    expect(findByIdAndUpdateStub.calledOnce).to.be.false;
    expect(findByIdUserStub.calledOnce).to.be.true;
    expect(categoryStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
  });

  it('should return an error if product could not be updated', async function() {
    const productId = new Types.ObjectId();
    const categoryId = new Types.ObjectId();
    const product = {
      id: productId,
      name: 'product1',
      description: 'description1',
      price: 100,
      currency: 'Naira',
      categoryId
    };
    const category = {
        id: categoryId,
        name: 'category1'
        };
    const user = {
      id: new Types.ObjectId(),
      products: [productId],
      populate: stub().returnsThis()
    };
    
    const findByIdAndUpdateStub = stub(Product, 'findByIdAndUpdate').throws(new Error('An error occured!'));
    const findByIdUserStub = stub(User, 'findById').returns(user);
    
    const categoryStub = stub(Category, 'findById').returns(category);
    const id = productId.toString();
    const result = await productMutationResolver.updateProduct(null, { id, product, categoryId}, { user });

    expect(result).to.be.null;
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
    expect(categoryStub.calledOnce).to.be.true;
    expect(findByIdUserStub.calledOnce).to.be.true;
  });
});
