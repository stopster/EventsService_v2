'use strict';

const https = require('https');
const log = global.log;

let cache = {};
function getApiUrl(ip) {
  return `https://ipapi.co/${ip}/json`;
}

module.exports = (ip) => {
  if(cache[ip]){
    return Promise.resolve(cache[ip]);
  }

  return new Promise((resolve, reject) => {
    https.get(getApiUrl(ip), (result) => {
      let output = '';
      result.on('data', (chunk) => {
        output += chunk;
      });

      result.on('end', () => {
        let outputJson = '';
        try{
          outputJson = JSON.parse(output);
          resolve(outputJson);
          cache[ip] = outputJson;
        } catch (e){
          reject(e);
        }
      });
    }).on('error', (e) => {
      log.debug('ipservice', 'Error on calling IP location service. Error: ' + e);
      reject(e);
    });
  });
};
