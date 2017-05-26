'use strict';

const express = require('express');
const Authentication = require('express-authentication');
const authentication = new Authentication();
const secretKeyAuth = require('../middlewares/auth');
const api = authentication.for('api').use(secretKeyAuth);

const router = express.Router();
const Event = require('../models/event');
const Billing = require('../models/billing');
const log = global.log;

router.get('/', api);

router.get('/', api.failed(), (req, res) => {
  res.statusCode = 403;
  res.send('You shall not pass!!');

});

router.get('/', api.required(), (req, res) => {
    Event.fetch(req.query).then((events) => {
      res.send(events);
    }, (error) => {
      log.error('storage', 'Can not fetch events. Error: ' + error);
    });
});

router.post('/', (req, res) => {
  // start billing (counting the duration) as soon as the request starts
  let billing = new Billing();

  // create event
  // not sure, whether these fields should be from a client data or a request object
  let eventConfig = Object.assign({}, {
    userIP: req.ip,
    pageReferer: req.header('Referrer')
  }, req.body);
  let event = new Event(eventConfig);

  event.save().then((result) => {
    return result;        // Return `saved`
  }, (error) => {
    log.error('storage', 'Can not save event to DB. Error: ' + error);
    return false;         // Return `saved`
  }).then((saved) => {    // Process billing in any case (successful saving or not)
    billing.linkToEvent(event).save().then(() => {
      res.send({
        id: event.ID,
        saved: saved,
        billed: true
      });
    }, () => {
      res.send({
        id: event.ID,
        saved: saved,
        billed: false
      });
    });
  });
});

module.exports = router;
