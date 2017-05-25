const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const sinon = require('sinon');
const Event = require('../models/event');

describe('Event model', () => {
  beforeEach(() => {
    global.dbPool = {
      saved: [],
      query: (query, eventObject) => {
        global.dbPool.saved.push(eventObject);
        return Promise.resolve({affectedRows: 1});
      }
    };

    global.log = {};
    global.log.info = global.log.warn = global.log.error = () => {};
  });

  afterEach(() => {
    global.dbPool.saved = [];
    // Restore original method from the spy if it was wrapped
    global.dbPool.query.restore && global.dbPool.query.restore();
  });


  it('should generate an ID for the event', () => {
    const event = new Event({});
    event.should.have.property('ID');
    event.ID.should.be.a('string');
  });

  it('should set `timestamp` if it was not provided', () => {
    const event = new Event({});
    event.should.have.property('timestamp');
    event.timestamp.should.be.a('number');
  });

  it('should set `browser` from userAgent', () => {
    const config = {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110'
    };
    const event = new Event(config);
    event.should.have.property('browser', 'Chrome');
  });

  it('should set `browser` to `N/A` if the userAgent is not valid or not provided', () => {
    const event = new Event({});
    event.should.have.property('browser', 'N/A');
  });

  it('should return `true` if it was saved to the db', () => {
    const event = new Event({});
    return event.save().should.eventually.equal(true);
  });

  it('should return `false` if it was not saved to the db', () => {
    global.dbPool.query = () => {
      return Promise.reject(false);
    };
    const event = new Event({});

    return event.save().then((result) => {
      result.should.be.false;
    });
  });

  it('should put all properties of itself into the database', () => {
    const event = new Event({});
    return event.save().then(() => {
      event.should.be.deep.equal(global.dbPool.saved[0]);
    });
  });

  it('should allow fetching events only by `pageID`, `browser`, and `country`', () => {
    const expectedQuery = 'SELECT * FROM events WHERE'
                      + ' pageID = \'pageID\' AND browser = \'browser\' AND country = \'country\''
                      + ' ORDER BY `timestamp`';
    const query = {
      pageID: 'pageID',
      browser: 'browser',
      country: 'country',
      sqlInjectedParam: 'IwillGetYourData'
    };

    const querySpy = sinon.spy(global.dbPool, 'query');

    return Event.fetch(query).then(() => {
      expect(querySpy.calledWith(expectedQuery));
    });
  });

});
