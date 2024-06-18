import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import Category from '../../models/category';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('createCategories', function() {
  afterEach(function() {
    restore();
  });

  it('should create categories from an array of categories and return sucessfully', async function() {
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

    const categories = [
      {
        _id: new Types.ObjectId(),
        name: 'Consumable Products|Food|Vegetables',
      },
      {
        _id: new Types.ObjectId(),
        name: 'Consumable Products|Food|Fruits',
      },
    ];

    const categoryStub = stub(Category, 'findOne').resolves(null);
    const categoryStub2 = stub(Category.prototype, 'save').resolves(categories);

    const result = await userMutationResolvers.createCategories(
      null, {
      name: [
        'Consumable Products|Food|Vegetables',
        'Consumable Products|Food|Fruits',
      ]},
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.deep.equal({ 'message': 'Many categories have been created successfully!', ok: true, statusCode: 201 });
    expect(categoryStub.calledTwice).to.be.true;
    expect(categoryStub2.calledTwice).to.be.true;
  });
  
  it('should create categories from an array of categories and return an error', async function() {
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
    const categories = [
      {
        _id: new Types.ObjectId(),
        name: 'Consumable Products|Food|Vegetables',
      },
      {
        _id: new Types.ObjectId(),
        name: 'Consumable Products|Food|Fruits',
      },
    ];

    const categoryStub = stub(Category, 'findOne').resolves({});

    const result = await userMutationResolvers.createCategories(null, {
      name: [
        'Consumable Products|Food|Vegetables',
        'Consumable Products|Food|Fruits',
      ],
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

  it('should return an error if the name is not an array', async function() {
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
    const result = await userMutationResolvers.createCategories(null, {
      name: 'Consumable Products|Food|Vegetables',
    },
    { req: {
      headers: {
        authorization: "fakeString"
      } 
      }
    });
    expect(result).to.deep.equal({ message: 'Name must be an array', statusCode: 400, ok: false });
  });

  it('should return an error if the name is not a string', async function() {
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
    const result = await userMutationResolvers.createCategories(null, {
      name: 123,
    },
    { req: {
      headers: {
        authorization: "fakeString"
      } 
      }
    });
    expect(result).to.deep.equal({ message: 'Name must be an array', statusCode: 400, ok: false });
  });

  it('should return an error if the name is empty', async function() {
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
    const result  =await userMutationResolvers.createCategories(null, {
      name: [],
    },
    { req: {
      headers: {
        authorization: "fakeString"
      } 
      }
    });
    expect(result).to.deep.equal({ message: 'Name cannot be empty', statusCode: 400, ok: false });
  });

  it('should return an error if the name is null', async function() {
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
    const result = await userMutationResolvers.createCategories(null, {
      name: null,
    },

    { req: {
      headers: {
        authorization: "fakeString"
      } 
      }
    });
    expect(result).to.deep.equal({ message: 'Name must be an array', statusCode: 400, ok: false });
  });

  it('should return an if an exception is raised', async function() {
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
    const categoryStub = stub(Category, 'findOne').throws(new Error('Category already exists'));
    const result = await userMutationResolvers.createCategories(null, {
      name: [
        'Consumable Products|Food|Vegetables',
        'Consumable Products|Food|Fruits',
      ],
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