import { expect } from 'chai';
import { stub, restore } from 'sinon';
import fetch from 'node-fetch';
import { userMutationResolvers } from '../../resolver/user&category.resolver';


describe('login', () => {
  let fetchStub;

  beforeEach(function() {
    // Stub fetch.default before each test
    fetchStub = stub(fetch, 'default');
  });

  afterEach(function() {
    // Restore fetch.default stub after each test
    fetchStub.restore();
  });

  it('should return a success message and token on successful login', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const expectedResponse = { message : 'User logged in successfully', token: 'fakeToken', statusCode: 200, ok: true };

    fetchStub.resolves(Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'fakeToken' })
      }));

    const result = await userMutationResolvers.login(null, { email, password });

    expect(result).to.deep.equal(expectedResponse);
    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.firstCall.args[1]).to.deep.equal({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  });


  it('should return an error message on failed login', async () => {
    const email = 'test@example.com';
    const password = 'wrongpassword';
    const expectedResponse = { statusCode: 400, message: "An error occurred!", ok: false };;

    fetchStub.resolves({
      ok: false,
      json: stub().returns({
        message: "An error occurred!"
      }),
      status: 400,
    });

    const result = await userMutationResolvers.login(null, { email, password });

    expect(result).to.deep.equal(expectedResponse);
    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.firstCall.args[1]).to.deep.equal({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  });

  it('should throw an error if the fetch request fails', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    fetchStub.rejects(new Error('Network error'));

    try {
      await userMutationResolvers.login(null, { email, password });
    } catch (error) {
      expect(error.message).to.equal('Network error');
      expect(fetchStub.calledOnce).to.be.true;
      expect(fetchStub.firstCall.args[1]).to.deep.equal({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    }
  });
});
