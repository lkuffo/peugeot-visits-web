/**
 * Router for the InterMine Registry API Instances operations
 */
var express = require('express');
var router = express.Router();
var Image = require('../models/image');

// this is our delete method
// this method removes existing data in our database
router.delete("/delete", (req, res) => {
  const { url } = req.body;
  const query = {
    url: {
      $eq: url
    }
  }
  Image.findOneAndDelete(query, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get("/", (req, res) => {
  Image.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/new", (req, res) => {
  let image = new Image();

  const { url } = req.body;

  image.url = url;

  image.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
