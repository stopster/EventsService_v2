'use strict';

const fs = require('fs');

module.exports = {
  billingApiUrl: 'http://api.playbuzz.com/eventrepoter-exercise',
  database: {
    host: 'mysql-test.playbuzz.com',
    user: 'root',
    password: 'Sharona12#',
    database: 'events_analytics__st_man',
    connectionLimit: 5
  },
  authorizationPassword: 'VERY_SECRET_PASSWORD',
  configureLogs: configureLogs
};

function configureLogs(Logger) {
  const accessStream = fs.createWriteStream('./logs/access');
  const billingStream = fs.createWriteStream('./logs/billing');
  const debugStream = fs.createWriteStream('./logs/debug');
  const logStream = fs.createWriteStream('./logs/log');

  Logger.on('log', (message) => {
    let stream;
    switch(message.prefix){
      case 'access':
        stream = accessStream;
        break;
      case 'billing':
        stream = billingStream;
        break;
      case 'debug':
        stream = debugStream;
      default:
        // no default stream, because we log everything in log
    }

    const time = new Date().toLocaleTimeString();
    if(stream){
      const prefix = pad(`[${time}][${message.level}]`, 20);

      stream.write(`${prefix} ${message.message}\n`);
    }

    const prefix = pad(`[${time}][${message.prefix}][${message.level}]`, 30);

    logStream.write(`${prefix} ${message.message}\n`);
  });

  return Logger;
}

function pad(string, space){
  return string + (new Array(space > string.length? (space - string.length): 0).join(' '));
}
