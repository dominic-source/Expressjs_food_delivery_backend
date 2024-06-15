import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import { Types } from 'mongoose';
import Order from '../../models/order';
import { ordersMutationResolver } from '../../resolver/orders.resolver';
import { myLogger } from '../../utils/mylogger';

const expect = chai.expect;
const { stub, restore } = sinon;

describe('deleteOrderItemsNow', function() {
  afterEach(function() {
    restore();
  });

  it('should return message after successfully deleting order items', async function() {
    const ids = [new Types.ObjectId().toString(), new Types.ObjectId().toString()];
    const result = await ordersMutationResolver.deleteOrderItemsNow(null, { ids });
    expect(result).to.have.property('message', 'Order items may have been deleted successfully!');
  });
});