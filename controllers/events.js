'use strict';

const express = require('express');
const authentication = require('express-authentication');
const auth = require('../middlewares/auth');

const router = express.Router();
const Event = require('../models/event');
const Billing = require('../models/billing');
const log = global.log;

router.get('/', auth);

router.get('/', authentication.required(), (req, res) => {
    Event.fetch(req.query).then((events) => {
      res.send(events);
    }, (error) => {
      log.error('storage', 'Can not fetch events. Error: ' + error);
    });
});

router.get('/', authentication.failed(), (req, res) => {
  res.statusCode = 403;
  res.send('You shall not pass!!');

  log.warn('access', 'Unauthorized access!');
});

router.post('/', (req, res) => {
  // start billing (counting the duration) as soon as the request starts
  let billing = new Billing();

  // create event
  // not sure, whether these data should be from client data or request object
  let eventConfig = Object.assign({}, {
    userIP: req.ip,
    pageReferer: req.header('Referrer')
  }, req.body);
  let event = new Event(eventConfig);

  event.save()
    .then((result) => {
      return result; // Return `saved`
    }, (error) => {
      log.error('storage', 'Can not save event to DB. Error: ' + error);
      return false; // Return `saved`
    }).then((saved) => {
      billing.linkToEvent(event).save()
        .then(() => {
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
