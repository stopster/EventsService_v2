const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Billing = require('../models/billing');

router.post('/', (req, res) => {
  // TODO save event to DB
  let event = new Event(req.body);
  event.save();

  // TODO process event with billingService
  let billing = new Billing(event);
  billing.save();

  res.send(event);
});

// TODO make request authorized
router.get('/', (req, res) => {
  // TODO get events from db
  res.send(Event.fetch(req.query));
  //
});

module.exports = router;
