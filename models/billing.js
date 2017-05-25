'use strict';

const request = require('request');
const apiUrl = 'http://api.playbuzz.com/eventrepoter-exercise';
const log = global.log;

class Billing {
  constructor(){
    this.duration = 0; // in nanoseconds
    this._hrtime = process.hrtime();
  }

  linkToEvent(event){
    this.ID = event.ID;
    this.clientIP = event.userIP;
    this.userAgent = event.userAgent;

    return this;
  }

  save(){
    const timeDiff = process.hrtime(this._hrtime);
    this.duration = timeDiff[0] * 1e9 + timeDiff[1];

    return new Promise((resolve, reject) => {
      request.post(apiUrl, {json: {
        "ID": this.ID,
        "Client IP": this.clientIP,
        "User-Agent": this.userAgent,
        "duration": this.duration
      }}, (error, response) => {
        if(!error && response.statusCode === 200){
          resolve();
        } else {
          log.error('billing', 'Service is not responding. Error: ' + error);
          reject();
        }
      });
    });
  }
}

module.exports = Billing;
