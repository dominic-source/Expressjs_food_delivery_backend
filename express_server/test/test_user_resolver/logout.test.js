import { expect } from 'chai';
import { stub } from 'sinon';
import fetch from 'node-fetch';
import { User } from '../../models/user';
import { userMutationResolvers } from '../../resolver/user&category.resolver';

describe('logout', () => {
  let findByIdAndUpdateStub;

  beforeEach(() => {
    findByIdAndUpdateStub = stub(User, 'findByIdAndUpdate');
  });

  afterEach(() => {
    findByIdAndUpdateStub.restore();
  });

  it('should return a success message on successful logout', async () => {
    const userId = '1234567890';
    const expectedResponse = { message: 'Logged out successfully' };

    findByIdAndUpdateStub.resolves(true);

    const result = await userMutationResolvers.logout(null, null, { user: { id: userId } });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal(userId);
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ isLoggedIn: false });
  });

  it('should return an error message on failed logout', async () => {
    const userId = '1234567890';
    const expectedResponse = { message: 'An error occured' };

    findByIdAndUpdateStub.resolves(false);

    const result = await userMutationResolvers.logout(null, null, { user: { id: userId } });

    expect(result).to.deep.equal(expectedResponse);
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal(userId);
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ isLoggedIn: false });
  });

  it('should throw an error if the findByIdAndUpdate fails', async () => {
    const userId = '1234567890';

    findByIdAndUpdateStub.rejects(new Error('Database error'));

    try {
      await userMutationResolvers.logout(null, null, { user: { id: userId } });
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error.message).to.equal('Database error');
      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal(userId);
      expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ isLoggedIn: false });
    }
  });
});