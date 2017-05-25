const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const should = chai.should();

const detectCountry = require('../helpers/detectCountry');

describe('detectCountry helper', () => {
  it('should return `US` when `IP` is 8.8.8.8', () => {
    const IP = '8.8.8.8';
    return detectCountry(IP).should.eventually.have.property('country', 'US');
  });

  it('should not return country when `IP` is reserved', () => {
    const IP = '127.0.0.1';
    return detectCountry(IP).should.eventually.have.property('reserved', true);
  });
});
