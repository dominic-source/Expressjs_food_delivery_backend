import chai from 'chai';
import sinon from 'sinon';
import { User } from '../../models/user';
import { userQueryResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('users', function() {
  afterEach(function() {
    restore();
  });

  it('should return all the users', async function() {
    const user = [
        {
            id: new Types.ObjectId(),
            name: 'user1',
            email: 'user1@example.com',
        },
        {
            id: new Types.ObjectId(),
            name: 'user2',
            email: 'user2@example.com',
        },
    ]
    const findStub = stub(User, 'find').resolves(user);
    const result = await userQueryResolvers.users();
    expect(result).to.deep.equal(user);
    findStub.restore();
  });

  it('should return an empty array if there are no users', async function() {
    const findStub = stub(User, 'find').resolves([]);
    const result = await userQueryResolvers.users();
    expect(result).to.deep.equal([]);
    findStub.restore();
  });

  it('should return an empty array if an exception is raised', async function() {
    const findStub = stub(User, 'find').throws(new Error('Error fetching users'));
    const result = await userQueryResolvers.users();
    expect(result).to.deep.equal([]);
    findStub.restore();
  });
});

