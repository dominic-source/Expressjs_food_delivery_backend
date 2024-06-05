import chai from 'chai';
import sinon from 'sinon';
import Category from '../../models/category';
import { userQueryResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('category', function() {
  afterEach(function() {
    restore();
  });

  it('should return a category base on their id', async function() {
    const id = new Types.ObjectId();
    const category = { name: 'test', _id: id };
    const findByIdStub = stub(Category, 'findById').returns(category);

    const result = await userQueryResolvers.category({}, { id });

    expect(findByIdStub.calledOnce).to.be.true;
    expect(result).to.be.eql(category);
  });

  it('should return null if the category is not found', async function() {
    const id = new Types.ObjectId();
    const findByIdStub = stub(Category, 'findById').returns(null);

    const result = await userQueryResolvers.category({}, { id });

    expect(findByIdStub.calledOnce).to.be.true;
    expect(result).to.be.null;
  });

  it('should return null if an exception is raised', async function() {
    const id = new Types.ObjectId();
    const findByIdStub = stub(Category, 'findById').throws(new Error('Error fetching category'));

    const result = await userQueryResolvers.category({}, { id });

    expect(findByIdStub.calledOnce).to.be.true;
    expect(result).to.be.null;
  });
});

