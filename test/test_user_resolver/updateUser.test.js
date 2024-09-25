import { expect } from 'chai';
import { stub } from 'sinon';
import fetch from 'node-fetch';
import { User } from '../../models/user';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

describe('updateUser', () => {
  let findByIdAndUpdateStub;
  before(function() {
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
  });

  beforeEach(function() {
    findByIdAndUpdateStub = stub(User, 'findByIdAndUpdate');
  });

  afterEach(function() {
    findByIdAndUpdateStub.restore();
  });

  it('should return a success message on successful update', async () => {
    const userId = '1234567890';
    const updatedUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phoneNumber: '1234567890',
      lgaId: '1234567890',
      vehicleNumber: 'ABC123',
      userType: 'buyer',
      buyerStatus: 'active',
      sellerStatus: 'inactive',
      dispatcherStatus: 'inactive',
    };
    const expectedResponse = { message: 'Updated successfully', statusCode: 200, ok: true };

    findByIdAndUpdateStub.resolves(true);

    const result = await userMutationResolvers.updateUser(
      null,
      updatedUser,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal(updatedUser);
  });

  it('should return an error message on failed update', async () => {
    const userId = '1234567890';
    const updatedUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phoneNumber: '1234567890',
      lgaId: '1234567890',
      vehicleNumber: 'ABC123',
      userType: 'buyer',
      buyerStatus: 'active',
      sellerStatus: 'inactive',
      dispatcherStatus: 'inactive',
    };
    const expectedResponse = { message: 'An error occurred!', statusCode: 500, ok: false };

    findByIdAndUpdateStub.resolves(false);

    const result = await userMutationResolvers.updateUser(
      null,
      updatedUser,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal(updatedUser);
  });

  it('should throw an error if the findByIdAndUpdate fails', async () => {
    const userId = '1234567890';
    const updatedUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phoneNumber: '1234567890',
      lgaId: '1234567890',
      vehicleNumber: 'ABC123',
      userType: 'buyer',
      buyerStatus: 'active',
      sellerStatus: 'inactive',
      dispatcherStatus: 'inactive',
    };

    findByIdAndUpdateStub.rejects(new Error('Database error'));

    const result = await userMutationResolvers.updateUser(
      null,
      updatedUser,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });
    expect(result).to.deep.equal({ message: 'An error occurred!', statusCode: 500, ok: false });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal(updatedUser);
  });

  it('should only update fields that are provided', async () => {
    const userId = '1234567890';
    const updatedUser = {
      firstName: 'Peter',
      lastName: 'Petrus',
      fathersonName: 'johndoe',
      username: undefined,
      email: undefined,
      phoneNumber: undefined,
      lgaId: undefined,
      vehicleNumber: undefined,
      userType: undefined,
      buyerStatus: undefined,
      sellerStatus: undefined,
      dispatcherStatus: undefined,
    };

    findByIdAndUpdateStub.resolves(true);

    await userMutationResolvers.updateUser(
      null,
      updatedUser,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('fathersonName');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('username');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('email');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('phoneNumber');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('lgaId');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('vehicleNumber');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('userType');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('buyerStatus');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('sellerStatus');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.not.have.property('dispatcherStatus');
  });

  it('should throw an error if an exception is thrown', async () => {
    const userId = '1234567890';
    const updatedUser = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      phoneNumber: '1234567890',
    };
    const expectedResponse = { message: 'An error occurred!', statusCode: 500, ok: false };

    findByIdAndUpdateStub.rejects(new Error());

    const result = await userMutationResolvers.updateUser(
      null,
      updatedUser,
      { req: {
        headers: {
         authorization: "fakeString"
        } 
       }
    });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal(updatedUser);
  });
});
