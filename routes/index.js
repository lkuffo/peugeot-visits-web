/**
 * Router for the InterMine Registry Front End endpoints.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');
var stream = require('stream');
var path = require('path');
var xlsx = require('node-xlsx');
var fs = require('fs');
var TARGET_PATH = path.resolve(__dirname, '../reports/');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('reportes', { title: 'Reportes', active: "reportes", user: req.user });
});

/* GET home page. */
router.get('/opciones', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('opciones', { title: 'Opciones de Visita', active: "opciones", user: req.user  });
});

/* GET home page. */
router.get('/usuarios', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('usuarios', { title: 'Usuarios', active: "usuarios", user: req.user  });
});

/* GET home page. */
router.get('/agencias', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('agencias', { title: 'Agencias', active: "agencias", user: req.user  });
});

router.get('/imagenes', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('imagenes', { title: 'Imágenes', active: "imagenes", user: req.user  });
});

/* GET home page. */
router.get('/reportes', function(req, res, next) {
  if (typeof req.user === "undefined"){
    return res.render('login');
  }
  res.render('reportes', { title: 'Reportes', active: "reportes", user: req.user  });
});


/**
 * Endpoint:  /login
 * Method:    GET
 * Description: Render the login view if the user is not logged in. Otherwise
 * redirect to home page.
 */
router.get('/login', function(req, res, next){
  if (req.query.success){
    res.render('login', { user: req.user, active: "login", message: "Username or password are incorrect. Please, try again." });
  } else {
    if (typeof req.user === "undefined"){
      res.render('login', {user: req.user, active: "login",});
    } else {
      res.redirect('/reportes');
    }
  }
});

/**
 * Endpoint:  /login
 * Method:    POST
 * Description: Authenticate user with passport. If failure, reload. If success,
 * redirect to home page.
 */
router.post('/login', passport.authenticate(
	'local', {
    successRedirect: '/',
    failureRedirect: '/login?success=0'
  })
);

/**
 * Endpoint:  /logout
 * Method:    GET
 * Description: Logout user. Redirect to home page.
 */
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/login');
});


router.post('/download', function(req, res, next){
  const fileName = "reportes.xlsx"
  const { byDayData, byHourData } = JSON.parse(req.body.data);
  const byDayDataLength = (byDayData.data ? byDayData.data.length : 0)
  const byHourDataLength = (byHourData.data ? byHourData.data.length : 0)

  let dataSheet1 = []
  dataSheet1.push(["Dia", "Visitas"])
  for (var i = 0; i < byDayDataLength; i++){
    dataSheet1.push([byDayData.labels[i], byDayData.data[i]]);
  }
  let dataSheet2 = []
  dataSheet2.push(["Hora", "Dia", "Visitas"])
  for (var j = 0; j < byHourDataLength; j++){
    let label = byHourData.labels[j].split("|")
    dataSheet2.push([label[0], label[1], byHourData.data[j]]);
  }

  var fileContents = xlsx.build([{name: "VisitasPorDia", data: dataSheet1}, {name: "VisitasPorHora", data: dataSheet2}]); // Returns a buffer
  var savedFilePath = path.join(TARGET_PATH, fileName);

  fs.writeFile(savedFilePath, fileContents, function() {
    res.status(200).json({
      msg: "ok"
    })
  });
});

router.get('/download', function(req, res, next){
  const fileName = "reportes.xlsx"
  var savedFilePath = path.join(TARGET_PATH, fileName);
  res.download(savedFilePath);
})

module.exports = router;
