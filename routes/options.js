/**
 * Router for the InterMine Registry API Instances operations
 */
var express = require('express');
var router = express.Router();
var Option = require('../models/option');

// this is our delete method
// this method removes existing data in our database
router.delete("/delete", (req, res) => {
  const { subtype } = req.body;
  const query = {
    subtype: {
      $eq: subtype
    }
  }
  Option.findOneAndDelete(query, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get("/", (req, res) => {
  Option.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/new", (req, res) => {
  let option = new Option();
  console.log(req.body);
  const { type, subtype } = req.body;

  option.type = type;
  option.subtype = subtype;

  option.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
