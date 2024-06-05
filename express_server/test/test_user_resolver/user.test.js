import chai from 'chai';
import sinon from 'sinon';
import { User } from '../../models/user';
import { userQueryResolvers } from '../../resolver/user&category.resolver';
import { Types } from 'mongoose';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('user', function() {
  afterEach(function() {
    restore();
  });

  it('should return a user base on their id', async function() {
    const user = {
        id: new Types.ObjectId(),
        name: 'user1',
        email: 'user1@gmail.com',
        password: '123456'
    }
    stub(User, 'findById').resolves(user);
    const result = await userQueryResolvers.user(null, null, { user });
    expect(result.name).to.be.deep.equal(user.name);    
  });

  it('should return null if the user is not found', async function() {
    stub(User, 'findById').resolves(null);
    const result = await userQueryResolvers.user(null, null, { user: { id: new Types.ObjectId() } });
    expect(result).to.be.null;
  });

  it('should return null if an exception is raised', async function() {
    stub(User, 'findById').throws(new Error('Error fetching user'));
    const result = await userQueryResolvers.user(null, null, { user: { id: new Types.ObjectId() } });
    expect(result).to.be.null;
  });
});

