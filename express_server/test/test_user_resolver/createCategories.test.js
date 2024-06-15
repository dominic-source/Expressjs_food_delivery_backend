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

    const result = await userMutationResolvers.createCategories(null, {
      name: [
        'Consumable Products|Food|Vegetables',
        'Consumable Products|Food|Fruits',
      ],
    });

    expect(result).to.deep.equal({'message': 'Many categories have been created successfully!'});
    expect(categoryStub.calledTwice).to.be.true;
    expect(categoryStub2.calledTwice).to.be.true;
  });
  
  it('should create categories from an array of categories and return an error', async function() {
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

    try {
      await userMutationResolvers.createCategories(null, {
        name: [
          'Consumable Products|Food|Vegetables',
          'Consumable Products|Food|Fruits',
        ],
      });
    } catch (error) {
      expect(error.message).to.equal('Category already exists');
      expect(categoryStub.calledOnce).to.be.true;
    }
  });

  it('should return an error if the name is not an array', async function() {
    try {
      await userMutationResolvers.createCategories(null, {
        name: 'Consumable Products|Food|Vegetables',
      });
    } catch (error) {
      expect(error.message).to.equal('Name must be an array');
    }
  });

  it('should return an error if the name is not a string', async function() {
    try {
      await userMutationResolvers.createCategories(null, {
        name: 123,
      });
    } catch (error) {
      expect(error.message).to.equal('Name must be an array');
    }
  });

  it('should return an error if the name is empty', async function() {
    try {
      await userMutationResolvers.createCategories(null, {
        name: [],
      });
    } catch (error) {
      expect(error.message).to.equal('Name cannot be empty');
    }
  });

  it('should return an error if the name is null', async function() {
    try {
      await userMutationResolvers.createCategories(null, {
        name: null,
      });
    } catch (error) {
      expect(error.message).to.equal('Name must be an array');
    }
  });

  it('should return an if an exception is raised', async function() {
    const categoryStub = stub(Category, 'findOne').throws(new Error('Category already exists'));
    try {
      await userMutationResolvers.createCategories(null, {
        name: [
          'Consumable Products|Food|Vegetables',
          'Consumable Products|Food|Fruits',
        ],
      });
    } catch (error) {
      expect(error.message).to.equal('Category already exists');
      expect(categoryStub.calledOnce).to.be.true;
    }    
  });

});