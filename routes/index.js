/**
 * Router for the InterMine Registry Front End endpoints.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var passport = require('passport');

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
    res.render('login', { user: req.user, message: "Username or password are incorrect. Please, try again." });
  } else {
    if (typeof req.user === "undefined"){
      res.render('login', {user: req.user});
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

/**
 * Endpoint:  /instance
 * Method:    GET
 * Description: Render add instance page if user is logged in. Otherwhise,
 * redirect to unauthorized.
 */
router.get('/instance', function(req, res, next) {
    if (typeof req.user === "undefined"){
      res.render('403');
    } else {
      res.render('addInstance', {user: req.user});
    }
});

module.exports = router;
