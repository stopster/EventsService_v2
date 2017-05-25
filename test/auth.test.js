const chai = require('chai');

const Auth = require('../middlewares/auth');
const config = require('../configs/dev');

global.log = {};
global.log.info = global.log.warn = global.log.error = () => {};

describe('Authentication middleware', () => {
  global.config = config;
  let req = {
    get: () => { return config.authorizationPassword; }
  };

  let res = {};
  let next = () => {};

  it('should match `Authorization` header with secret in config and set authenticated', () => {
    Auth(req, res, next);
    req.authenticated.should.be.true;
  });

  it('should set authenticated to false if `Authorization` header is wrong', () => {
    let req = {
      get: () => { return 'WrongSecurityKey'; }
    };

    Auth(req, res, next);
    req.authenticated.should.be.false;
    req.authentication.should.include.keys('error');
  })
});
