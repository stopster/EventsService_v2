const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
const nock = require('nock');
const config = require('../configs/dev');

const Billing = require('../models/billing');
const Event = require('../models/event');

describe('Billing model', () => {
  let apiMock;
  let billing;
  let eventConfig;
  let event;

  global.config = config;
  global.log = {};
  global.log.info = global.log.warn = global.log.error = () => {};

  beforeEach(() => {
    apiMock = nock(config.billingApiUrl);
    billing = new Billing();
    eventConfig = {
      userIP: '0.0.0.0',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110'
    };

    event = new Event(eventConfig);
  });

  it('should start timer right after instantiation', () => {
    billing.duration.should.be.equal(0);
    billing._hrtime[1].should.not.equal(0);
  });

  it('should link to the event by setting ID, userAgent and IP from it', () => {
    billing.linkToEvent(event);
    billing.ID.should.be.equal(event.ID);
    billing.userAgent.should.be.equal(event.userAgent);
    billing.clientIP.should.be.equal(event.userIP);
  });

  it('should set duration in nanoseconds on save', () => {
    apiMock.post('/').reply(200, 'billed');

    let promise = billing.save().catch(()=>{ let a = 3});
    billing.duration.should.not.equal(0);

    return promise.should.eventually.resolve;
  });

  it('should log event id when request failed', () => {
    apiMock.post('/').reply(500, 'not billed');
    const logSpy = sinon.spy(global.log, 'error');

    return billing.linkToEvent(event).save().catch(() => {
      logSpy.getCall(0).args[1].should.contain(`ID: ${billing.ID}`);
    });
  });
});
