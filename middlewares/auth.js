'use strict';

module.exports = (req, res, next) => {
  const config = global.config;

  req.challenge = req.get('Authorization');
  req.authenticated = req.challenge === config.authorizationPassword;

  if(!req.authenticated){
    req.authentication = { error: 'Invalid security password!' };
  }

  next();
};
