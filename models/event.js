const detectBrowser = require('../helpers/detectBrowser');

class Event {
  constructor(config){
    this.id = 'page' + parseInt(Math.random()*1000);
    this.timestamp = config.timestamp || Date.now().getTime();
    this.userId = config.userId;
    this.pageId = config.pageId;
    this.pageUrl = config.pageUrl;
    this.pageReferer = config.pageReferer;
    this.userAgent = config.userAgent;
    this.screenResolution = config.screenResolution;
    this.userIP = config.userIP;
    this.browser = detectBrowser(this.userAgent).name;

    console.log('create event');
  }

  save (){
    // TODO save event to db
    console.log('save event');
  }

  static fetch (criteria){
    // TODO get from db according to criteria
    return {some: 'event'};
  }
}

module.exports = Event;
