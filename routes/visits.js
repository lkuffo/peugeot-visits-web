var express = require('express');
var router = express.Router();

var Visit = require('../models/visit');

// this is our get method
// this method fetches all available data in our database
router.get("/", (req, res) => {
  Visit.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/new", (req, res) => {
  let visit = new Visit();
  console.log(req.body);
  const { createdAt, agency, type, subtype } = req.body;

  visit.createdAt = createdAt;
  visit.agency = agency;
  visit.type = type;
  visit.subtype = subtype;

  visit.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
