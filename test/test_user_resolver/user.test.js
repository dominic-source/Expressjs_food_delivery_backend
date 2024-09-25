import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { User } from '../../models/user';
import { userQueryResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('user', function() {
  let fetchStub;
  let userStub;

  beforeEach(function() {
    // Stub authRequest
    fetchStub = stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: new Types.ObjectId(),
        },
        isAdmin: true
      }),
      status: 200
    });

    // Stub User.findOne
    userStub = stub(User, 'findOne');
  });

  afterEach(function() {
    // Restore stubs
    // fetchStub.restore();
    restore();
  });

  it('should return a user base on their id', async function() {
    const user = {
        id: new Types.ObjectId(),
        name: 'user1',
        email: 'user1@gmail.com',
        password: '123456'
    }
    userStub.resolves(user);
    const result = await userQueryResolvers.user(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.be.deep.equal({ userData: user, statusCode: 200, ok: true });    
  });

  it('should return null if the user is not found', async function() {
    userStub.resolves(null);
    const result = await userQueryResolvers.user(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });
    expect(result).to.be.deep.equal({ userData: null, statusCode: 200, ok: true });
  });

  it('should return null if an exception is raised', async function() {
    userStub.throws(new Error('Error fetching user'));
    const result = await userQueryResolvers.user(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });
    expect(result).to.be.deep.equal({ message: 'An error occurred!', statusCode: 500, ok: false });
  });
});
