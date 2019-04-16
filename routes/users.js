var express = require('express');
var router = express.Router();

var User = require('../models/user');

// this is our delete method
// this method removes existing data in our database
router.delete("/delete", (req, res) => {
  const { username } = req.body;
  const query = {
    user: {
      $eq: username
    }
  }
  User.findOneAndDelete(query, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get("/", (req, res) => {
  User.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/new", (req, res) => {
  let user = new User();
  console.log(req.body);
  const { username, password, type } = req.body;

  user.user = username;
  user.password = password;
  user.type = type;

  user.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
