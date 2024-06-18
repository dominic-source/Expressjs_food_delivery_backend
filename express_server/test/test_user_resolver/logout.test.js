import { expect } from 'chai';
import { stub } from 'sinon';
import fetch from 'node-fetch';
import { User } from '../../models/user';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

describe('logout', () => {
  let findByIdAndUpdateStub;
  let userId;
  let fetchStub;

  before(function() {
    // stud authRequest
    fetchStub = stub(fetch, 'default').resolves({
      ok: true,
      json: stub().returns({
        user: {
          _id: userId,
          id: userId
          },
        isAdmin: true
      }),
      status: 200
    });
  });

  beforeEach(function() {
    findByIdAndUpdateStub = stub(User, 'findByIdAndUpdate');
    userId = new Types.ObjectId().toString();
  });

  afterEach(function() {
    findByIdAndUpdateStub.restore();
  });

  after(function() {
    fetchStub.restore();
  });

  it('should return a success message on successful logout', async () => {
    const expectedResponse = {'message': 'Logged out successfully', statusCode: 200, ok: true};

    findByIdAndUpdateStub.resolves(true);

    const result = await userMutationResolvers.logout(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ isLoggedIn: false });
  });

  it('should return an error message on failed logout', async () => {
    const expectedResponse = {'message': 'Unable to logout user!', statusCode: 400, ok: false };
    findByIdAndUpdateStub.resolves(false);

    const result = await userMutationResolvers.logout(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ isLoggedIn: false });
  });

  it('should throw an error if the findByIdAndUpdate fails', async () => {

    findByIdAndUpdateStub.rejects(new Error('Database error'));

    const result = await userMutationResolvers.logout(
      null,
      null,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
      });
    expect(result).to.be.deep.equal({ message: 'An error occurred!', statusCode: 500, ok: false });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ isLoggedIn: false });
  });
});
