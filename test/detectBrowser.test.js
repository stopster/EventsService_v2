const chai = require('chai');
const should = chai.should();

const detectBrowser = require('../helpers/detectBrowser');
describe('detectBrowser helper', () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36';

  it('should return object with browser name and version', () => {
    let browser = detectBrowser(userAgent);
    browser.name.should.equal('Chrome');
    browser.version.should.equal('58');
  });

  it('should return `N/A` if it can not detect browser', () => {
    let browser = detectBrowser(undefined);
    browser.name.should.equal('N/A');
    browser.version.should.equal('0');
  });
});
