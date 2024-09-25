import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { User } from '../../models/user';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('createUser', function() {
  afterEach(function() {
    restore();
  });

  it('should create a user', async function() {
    const user = { 
        username: 'username',
        email: 'email',
        passwordHash: 'passwordHash',
        phoneNumber: 'phoneNumber',
        userType: 'userType',
        status: 'status',
        firstName: 'firstName',
        lastName: 'lastName',
        lgaId: 'lgaId', 
        vehicleNumber: '123456',
        }

    const userCreateStub = stub(User.prototype, 'save').resolves(user);
    const result = await userMutationResolvers.createUser(null, { user });
    expect(result.statusCode).to.equal(201);
    expect(userCreateStub.calledOnce).to.be.true;
  });

  it('should throw an error if an exception occurs', async function() {
    const user = { 
        username: 'username',
        email: 'email',
        passwordHash: 'passwordHash',
        phoneNumber: 'phoneNumber',
        userType: 'userType',
        status: 'status',
        firstName: 'firstName',
        lastName: 'lastName',
        lgaId: 'lgaId', 
        vehicleNumber: '123456',
        }

    const userCreateStub = stub(User.prototype, 'save').throws(new Error('Error creating user'));
    try {
      await userMutationResolvers.createUser(null, { user });
    } catch (error) {
      expect(error.message).to.equal('Error creating user');
      expect(userCreateStub.calledOnce).to.be.true;
    }
  });
});