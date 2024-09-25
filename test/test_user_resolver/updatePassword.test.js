import { expect } from 'chai';
import { stub } from 'sinon';
import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import { userMutationResolvers } from '../../resolver/user&category.resolver';

describe('updatePassword', () => {
  let findStub;
  let findByIdAndUpdateStub;
  let genSaltStub;
  let hashStub;

  beforeEach(function() {
    findStub = stub(User, 'find');
    findByIdAndUpdateStub = stub(User, 'findByIdAndUpdate');
    genSaltStub = stub(bcrypt, 'genSalt');
    hashStub = stub(bcrypt, 'hash');
  });

  afterEach(function() {
    findStub.restore();
    findByIdAndUpdateStub.restore();
    genSaltStub.restore();
    hashStub.restore();
  });

  it('should return a success message on successful password update', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'validtoken';
    const expectedResponse = {'message': 'Password updated successfully', statusCode: 200, ok: true };
    const currentDate = new Date();
    findStub.resolves([{ id: '1234567890', resetPasswordToken: token + ' ' + new Date(currentDate.getTime() + 3600000).toISOString() }]);
    genSaltStub.resolves('salt');
    hashStub.resolves('hashedPassword');
    findByIdAndUpdateStub.resolves(true);

    const result = await userMutationResolvers.updatePassword(null, { email, password, token });

    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal('1234567890');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ passwordHash: 'hashedPassword' });
    expect(genSaltStub.calledOnce).to.be.true;
    expect(hashStub.calledOnce).to.be.true;
    expect(hashStub.firstCall.args[0]).to.equal(password);
    expect(hashStub.firstCall.args[1]).to.equal('salt');
  });

  it('should return an error message if the user is not found', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'validtoken';
    const expectedResponse = {'message': 'An error occurred!', statusCode: 401, ok: false };

    findStub.resolves([]);

    const result = await userMutationResolvers.updatePassword(null, { email, password, token });

    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.notCalled).to.be.true;
    expect(genSaltStub.notCalled).to.be.true;
    expect(hashStub.notCalled).to.be.true;
  });

  it('should return an error message if the token is invalid', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'invalidtoken';
    const expectedResponse = {'message': 'An error occurred!', statusCode: 401, ok: false };

    findStub.resolves([{ id: '1234567890', resetPasswordToken: 'validtoken ' + new Date().toISOString() }]);

    const result = await userMutationResolvers.updatePassword(null, { email, password, token });

    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.notCalled).to.be.true;
    expect(genSaltStub.notCalled).to.be.true;
    expect(hashStub.notCalled).to.be.true;
  });

  it('should return an error message if the token is expired', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'validtoken';
    const expectedResponse = { 'message': 'An error occurred!', statusCode: 401, ok: false };

    findStub.resolves([{ id: '1234567890', resetPasswordToken: token + ' ' + new Date(Date.now() - 1000 * 60 * 60).toISOString() }]);

    const result = await userMutationResolvers.updatePassword(null, { email, password, token });

    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.notCalled).to.be.true;
    expect(genSaltStub.notCalled).to.be.true;
    expect(hashStub.notCalled).to.be.true;
  });

  it('should return an error message if the findByIdAndUpdate fails', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'validtoken';
    const expectedResponse = { 'message': 'An error occurred!', statusCode: 500, ok: false };
    const currentDate = new Date();
    findStub.resolves([{ id: '1234567890', resetPasswordToken: token + ' ' + new Date(currentDate.getTime() + 3600000).toISOString() }]);
    genSaltStub.resolves('salt');
    hashStub.resolves('hashedPassword');
    findByIdAndUpdateStub.rejects(new Error('Database error'));

    const result = await userMutationResolvers.updatePassword(null, { email, password, token });
    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.calledOnce).to.be.true;
    expect(findByIdAndUpdateStub.firstCall.args[0]).to.equal('1234567890');
    expect(findByIdAndUpdateStub.firstCall.args[1]).to.deep.equal({ passwordHash: 'hashedPassword' });
    expect(genSaltStub.calledOnce).to.be.true;
    expect(hashStub.calledOnce).to.be.true;
    expect(hashStub.firstCall.args[0]).to.equal(password);
    expect(hashStub.firstCall.args[1]).to.equal('salt');
  });

  it('should return an error message if the genSalt fails', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'validtoken';
    const expectedResponse = { 'message': 'An error occurred!', statusCode: 500, ok: false };
    const currentDate = new Date();
    findStub.resolves([{ id: '1234567890', resetPasswordToken: token + ' ' + new Date(currentDate.getTime() + 3600000).toISOString() }]);
    genSaltStub.rejects(new Error('GenSalt error'));

    const result =await userMutationResolvers.updatePassword(null, { email, password, token });
    expect(result).to.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.notCalled).to.be.true;
    expect(genSaltStub.calledOnce).to.be.true;
    expect(hashStub.notCalled).to.be.true;
  });

  it('should return an error message if the hash fails', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'validtoken';
    const expectedResponse = { 'message': 'An error occurred!', statusCode: 500, ok: false };
    const currentDate = new Date();
    findStub.resolves([{ id: '1234567890', resetPasswordToken: token + ' ' + new Date(currentDate.getTime() + 3600000).toISOString() }]);
    genSaltStub.resolves('salt');
    hashStub.rejects(new Error('Hash error'));
    const result = await userMutationResolvers.updatePassword(null, { email, password, token });
    expect(result).to.be.deep.equal(expectedResponse);
    expect(findStub.calledOnce).to.be.true;
    expect(findStub.firstCall.args[0]).to.deep.equal({ email });
    expect(findByIdAndUpdateStub.notCalled).to.be.true;
    expect(genSaltStub.calledOnce).to.be.true;
    expect(hashStub.calledOnce).to.be.true;
    expect(hashStub.firstCall.args[0]).to.equal(password);
    expect(hashStub.firstCall.args[1]).to.equal('salt');
  });
});