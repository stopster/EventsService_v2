'use strict';

module.exports = (req, res, next) => {
  const config = global.config;
  const log = global.log;

  req.challenge = req.get('Authorization');
  req.authenticated = req.challenge === config.authorizationPassword;

  if(!req.authenticated){
    req.authentication = { error: 'Invalid security password!' };
    res.statusCode = 403;
    res.send('You shall not pass!!');

    log.warn('access', 'Unauthorized access!');
  }

  next();
};
