import chai from 'chai';
import sinon from 'sinon';
import Category from '../../models/category';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('createCategory', function() {
  afterEach(function() {
    restore();
  });

  it('should return a new category', async function() {
    const category = {
    _id: new Types.ObjectId(),
    name: 'Consumable Products|Food|Vegetables',
    };

    const categoryStub = stub(Category, 'findOne').resolves(null);
    const categoryStub2 = stub(Category.prototype, 'save').resolves(category);

    const result = await userMutationResolvers.createCategory(null, {
    name: 'Consumable Products|Food|Vegetables',
    });

    expect(result).to.deep.equal(category);
    expect(categoryStub.calledOnce).to.be.true;
    expect(categoryStub2.calledOnce).to.be.true;
  });

  it('should throw an error if category already exists', async function() {
      const categoryStub = stub(Category, 'findOne').resolves({});
  
      try {
        await userMutationResolvers.createCategory(null, {
          name: 'Consumable Products|Food|Vegetables',
      });
      } catch (error) {
        expect(error.message).to.equal('Category already exists');
        expect(categoryStub.calledOnce).to.be.true;
      }
  });

  it('should throw an error if category name is invalid', async function() {
    try {
      await userMutationResolvers.createCategory(null, {
        name: 'Invalid Category Name',
      });
    } catch (error) {
      expect(error.message).to.equal('Invalid category format');
    }
  });

  it('should throw an error if category name is empty', async function() {
    try {
      await userMutationResolvers.createCategory(null, {
        name: '',
      });
    } catch (error) {
      expect(error.message).to.equal('Invalid category format');
    }
  });

  it('should throw an error if category name is null', async function() {
    try {
      await userMutationResolvers.createCategory(null, {
        name: null,
      });
    } catch (error) {
      expect(error.message).to.equal('Invalid category format');
    }
  });

  it('should throw an error if category name is undefined', async function() {
    try {
      await userMutationResolvers.createCategory(null, {
        name: undefined,
      });
    } catch (error) {
      expect(error.message).to.equal('Invalid category format');
    }
  });

  it('should throw an error if category name is not a string', async function() {
    try {
      await userMutationResolvers.createCategory(null, {
        name: 123,
      });
    } catch (error) {
      expect(error.message).to.equal('Invalid category format');
    }
  });

  it('should throw an error if an exception is thrown', async function() {
    const categoryStub = stub(Category, 'findOne').throws(new Error('Database error'));
  
    try {
      await userMutationResolvers.createCategory(null, {
        name: 'Consumable Products|Food|Vegetables',
      });
    } catch (error) {
      expect(error.message).to.equal('Database error');
      expect(categoryStub.calledOnce).to.be.true;
    }
  });
});