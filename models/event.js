'use strict';

const detectBrowser = require('../helpers/detectBrowser');
const detectCountry = require('../helpers/detectCountry');
const mysql = require('mysql');

class Event {
  constructor(config){
    // id would be a hash, but for the sake of demo make it readable
    this.ID = 'event' + parseInt(Math.random()*1000);

    this.pageReferer = config.pageReferer;
    this.userIP = config.userIP;
    // assume, that event occured just now, if empty
    this.timestamp = config.timestamp               || Date.now();
    this.userID = config.userId                     || null;
    this.pageID = config.pageId                     || null;
    this.pageUrl = config.pageUrl                   || null;
    this.userAgent = config.userAgent               || null;
    this.screenResolution = config.screenResolution || null;
    this.browser = detectBrowser(this.userAgent).name;
  }

  save (){
    const db = global.dbPool;

    return this._prepareModel().then(() => {
      return db.query('INSERT INTO events SET ?', this).then((result) => {
        return result.affectedRows > 0;
      }, (error) => {
        return error;
      });
    });
  }

  _prepareModel(){
    const log = global.log;

    return detectCountry(this.userIP).then((result) => {
      this.country = result.reserved? 'N/A': result.country;
    }, (error) => {
      log.debug('iplocation', 'Can not detect country from IP. Error: ' + error);
      this.country = null;
    });
  }

  static fetch (criteria){
    const db = global.dbPool;

    const allowed = ['pageID', 'browser', 'country'];
    let query = 'SELECT * FROM events';
    let conditions = [];
    allowed.forEach((i) => {
      if(criteria[i]){
        let escapedValue = mysql.escape(criteria[i]);
        conditions.push(`${i} = ${escapedValue}`);
      }
    });

    query += conditions.length? ' WHERE ' + conditions.join(' AND '): '';
    query += ' ORDER BY `timestamp`';

    return db.query(query);
  }
}

module.exports = Event;
