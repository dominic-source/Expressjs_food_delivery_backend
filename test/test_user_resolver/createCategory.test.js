import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import Category from '../../models/category';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('createCategory', function() {
  beforeEach(function() {
    const userId = new Types.ObjectId().toString();
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          // _id: userId,
          },
        isAdmin: true
      }),
      status: 200
    });
  });

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

    const result = await userMutationResolvers.createCategory(
      null,
      {
        name: 'Consumable Products|Food|Vegetables',
      },
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });
    expect(result).to.deep.equal({ categoryData: category, statusCode: 201, ok: true });
    expect(categoryStub.calledOnce).to.be.true;
    expect(categoryStub2.calledOnce).to.be.true;
  });

  it('should throw an error if category already exists', async function() {
    const categoryStub = stub(Category, 'findOne').resolves({});
        const result = await userMutationResolvers.createCategory(null, {
        name: 'Consumable Products|Food|Vegetables',
    },
    { req: {
      headers: {
        authorization: "fakeString"
      } 
      }
    });
    expect(result).to.deep.equal({ message: 'Category already exists', statusCode: 400, ok: false});
    expect(categoryStub.calledOnce).to.be.true;
  });

  it('should throw an error if category name is invalid', async function() {
    const result = await userMutationResolvers.createCategory(null, {
      name: 'Invalid Category Name',
    },
    { req: {
      headers: {
        authorization: "fakeString"
      } 
      }
    });
    expect(result).to.deep.equal({ message: 'Invalid category format', statusCode: 400, ok: false});
  });

  it('should throw an error if category name is empty', async function() {
    const result = await userMutationResolvers.createCategory(null, {
      name: '',
    },
    { req: {
      headers: {
       authorization: "fakeString"
      } 
     }
    });
    expect(result).to.deep.equal({ message: 'Invalid category format', statusCode: 400, ok: false});
  });

  it('should throw an error if category name is null', async function() {
    const result = await userMutationResolvers.createCategory(null, {
      name: null,
    },
    { req: {
      headers: {
       authorization: "fakeString"
      } 
     }
    });
    expect(result).to.deep.equal({ message: 'Invalid category format', statusCode: 400, ok: false});
  });

  it('should throw an error if category name is undefined', async function() {
    const result = await userMutationResolvers.createCategory(null, {
      name: undefined,
    },
    { req: {
      headers: {
       authorization: "fakeString"
      } 
     }
    });
    expect(result).to.deep.equal({ message: 'Invalid category format', statusCode: 400, ok: false});
  });

  it('should throw an error if category name is not a string', async function() {
    const result = await userMutationResolvers.createCategory(null, {
      name: 123,
    },
    { req: {
      headers: {
       authorization: "fakeString"
      } 
     }
    });
    expect(result).to.deep.equal({ message: 'Invalid category format', statusCode: 400, ok: false});
  });

  it('should throw an error if an exception is thrown', async function() {
    const categoryStub = stub(Category, 'findOne').throws(new Error('Database error'));
  
    const result = await userMutationResolvers.createCategory(null, {
      name: 'Consumable Products|Food|Vegetables',
    },
    { req: {
      headers: {
       authorization: "fakeString"
      } 
     }
    });
    expect(result).to.deep.equal({ message: 'An error occurred!', statusCode: 500, ok: false});
    expect(categoryStub.calledOnce).to.be.true;
  });
});
