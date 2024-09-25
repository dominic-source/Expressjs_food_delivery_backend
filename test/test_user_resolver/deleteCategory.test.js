import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import Category from '../../models/category';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('deleteCategory', function() {
  beforeEach(function() {
    const userId = new Types.ObjectId().toString();
    // stud authRequest
    stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId,
          },
        isAdmin: true
      }),
      status: 200
    });
  });

  afterEach(function() {
    restore();
  });

  it('should delete a category', async function() {
    const category = {
      _id: new Types.ObjectId(),
      name: 'Consumable Products|Food|Vegetables',
    };

    const categoryStub = stub(Category, 'findByIdAndDelete').resolves(category);

    const result = await userMutationResolvers.deleteCategory(
      null, {
      id: category._id,
    }, { req: {
      headers: {
       authorization: "fakeString"
      } 
     }
    });

    expect(result).to.deep.equal({ message: 'Category has been deleted successfully!', statusCode: 201, ok: true });
    expect(categoryStub.calledOnce).to.be.true;
    expect(categoryStub.calledWith(category._id)).to.be.true;
  });

  it('should throw an error if the category is not found', async function() {
    const category = {
      _id: new Types.ObjectId(),
      name: 'Consumable Products|Food|Vegetables',
    };

    const categoryStub = stub(Category, 'findByIdAndDelete').resolves(null);

    const result = await userMutationResolvers.deleteCategory(null, {
      id: category._id,
      },
      { req: {
        headers: {
        authorization: "fakeString"
        } 
      }
      }
    );
    expect(result).to.deep.equal({ message: 'Category not found', statusCode: 404, ok: false});
    expect(categoryStub.calledOnce).to.be.true;
    expect(categoryStub.calledWith(category._id)).to.be.true;
  });
});