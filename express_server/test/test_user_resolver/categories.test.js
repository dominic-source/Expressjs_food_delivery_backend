import chai from 'chai';
import sinon from 'sinon';
import Category from '../../models/category';
import { userQueryResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('categories', function() {
  afterEach(function() {
    restore();
  });

  it('should return all the categories', async function() {
    const categories = [
        {
            id: new Types.ObjectId(),
            name: 'category1',
        },
        {
            id: new Types.ObjectId(),
            name: 'category2',
        },
    ]
    const findStub = stub(Category, 'find').resolves(categories);
    const result = await userQueryResolvers.categories();
    expect(result).to.deep.equal(categories);
    expect(findStub.calledOnce).to.be.true;
  });

  it('should return an empty array if there are no categories', async function() {
    const findStub = stub(Category, 'find').resolves([]);
    const result = await userQueryResolvers.categories();
    expect(result).to.deep.equal([]);
    expect(findStub.calledOnce).to.be.true;
  });

  it('should return an empty array if an exception is raised', async function() {
    const findStub = stub(Category, 'find').throws(new Error('Error fetching category'));
    const result = await userQueryResolvers.categories();
    expect(result).to.deep.equal([]);
    expect(findStub.calledOnce).to.be.true;
  });
});

