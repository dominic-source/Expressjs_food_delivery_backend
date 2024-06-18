import { expect } from 'chai';
import sinon from 'sinon';
import { User } from '../../models/user';
import Bull from 'bull';
import { userMutationResolvers } from '../../resolver/user&category.resolver';
const { stub, restore } = sinon;

describe('forgotPassword', () => {
  let findByIdAndUpdateStub;
  let findStub;
  let addStub;

  beforeEach(() => {
    findByIdAndUpdateStub = stub(User, 'findByIdAndUpdate');
    findStub = stub(User, 'find');
    addStub = stub(Bull.prototype, 'add');
  });

  afterEach(() => {
    findByIdAndUpdateStub.restore();
    findStub.restore();
    addStub.restore();
    restore();
  });

  it('should return a success message on successful forgot password request', async () => {
    const email = 'test@example.com';
    const expectedResponse = {'message': 'Get the reset token from your email', statusCode: 200, ok: true };

    findStub.resolves([{ id: '1234567890' }]);
    findByIdAndUpdateStub.resolves(true);
    addStub.resolves(true);

    const result = await userMutationResolvers.forgotPassword(null, { email });

    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal('1234567890');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.have.property('resetPasswordToken');
    expect(addStub.calledOnce).to.be.true;
    expect(addStub.firstCall.args[0]).to.have.property('to', email);
    expect(addStub.firstCall.args[0]).to.have.property('token');
  });

  it('should return an error message if the user is not found', async () => {
    const email = 'test@example.com';
    const expectedResponse = {'message': 'User was not found!', statusCode: 404, ok: true };

    findStub.resolves([]);

    const result = await userMutationResolvers.forgotPassword(null, { email });

    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.notCalled).to.be.true;
    expect(addStub.notCalled).to.be.true;
  });

  it('should return an error message if the findByIdAndUpdate fails', async () => {
    const email = 'test@example.com';
    const expectedResponse = {'message': 'An error occurred!', statusCode: 500, ok: true };

    findStub.resolves([{ id: '1234567890' }]);
    findByIdAndUpdateStub.rejects(new Error('Database error'));

      const result = await userMutationResolvers.forgotPassword(null, { email });
      expect(result).to.deep.equal(expectedResponse);
      expect(findStub.calledOnce).to.be.true;
      expect(findStub.firstCall.args[0]).to.deep.equal({ email });
      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal('1234567890');
      expect(addStub.notCalled).to.be.true;
  });

  it('should return an error message if the queue add fails', async () => {
    const email = 'test@example.com';
    const expectedResponse = {'message': 'An error occurred!', statusCode: 500, ok: true };

    findStub.resolves([{ id: '1234567890' }]);
    findByIdAndUpdateStub.resolves(true);
    addStub.rejects(new Error('Queue error'));

      const result = await userMutationResolvers.forgotPassword(null, { email });
      expect(result).to.be.deep.equal(expectedResponse);
      expect(findStub.calledOnce).to.be.true;
      expect(findStub.firstCall.args[0]).to.deep.equal({ email });
      expect(findByIdAndUpdateStub.calledOnce).to.be.true;
      expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal('1234567890');
      expect(addStub.calledOnce).to.be.true;
  });
});
