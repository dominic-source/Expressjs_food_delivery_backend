import { expect } from 'chai';
import { stub } from 'sinon';
import { User } from '../../models/user';
import { userMutationResolvers } from '../../resolver/user&category.resolver';

describe('deleteUser', () => {
  let findByIdAndUpdateStub;

  beforeEach(() => {
    findByIdAndUpdateStub = stub(User, 'findByIdAndUpdate');
  });

  afterEach(() => {
    findByIdAndUpdateStub.restore();
  });

  it('should delete a user successfully', async () => {
    const userId = '123';
    findByIdAndUpdateStub.resolves();

    const result = await userMutationResolvers.deleteUser(null, null, { user: { id: userId } });

    expect(result).to.deep.equal({ message: 'User deleted successfully!' });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.calledWith(userId, { isDeleted: true })).to.be.true;
  });

  it('should handle errors gracefully', async () => {
    const userId = '123';
    const error = new Error('Something went wrong');
    findByIdAndUpdateStub.rejects(error);

    const result = await userMutationResolvers.deleteUser(null, null, { user: { id: userId } });

    expect(result).to.deep.equal({ message: 'An error occurred!' });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.calledWith(userId, { isDeleted: true })).to.be.true;
  });
});