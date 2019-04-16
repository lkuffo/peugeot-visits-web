/**
 * Router for the InterMine Registry API Instances operations
 */
var express = require('express');
var router = express.Router();
var Agency = require('../models/agencia');

// this is our delete method
// this method removes existing data in our database
router.delete("/delete", (req, res) => {
  const { nombre } = req.body;
  const query = {
    nombre: {
      $eq: nombre
    }
  }
  Agency.findOneAndDelete(query, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our get method
// this method fetches all available data in our database
router.get("/", (req, res) => {
  Agency.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.post("/new", (req, res) => {
  let agency = new Agency();
  console.log(req.body);
  const { nombre, direccion } = req.body;

  agency.nombre = nombre;
  agency.direccion = direccion;

  agency.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
