var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require("passport");

var index = require('./routes/index');
var users = require('./routes/users');
var visits = require('./routes/visits');
var options = require('./routes/options');
var agencias = require('./routes/agencias');
var images = require('./routes/images');
var auth = require('./routes/auth');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var cors = require('cors')
app.use(cors())

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
  { 
    extended: false,
    limit: '50mb'
  }
));
app.use(cookieParser());

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/reports', express.static(__dirname + '/reports'));

app.use('/', index);
app.use('/users', users);
app.use('/visits', visits)
app.use('/options', options);
app.use('/agency', agencias);
app.use('/images', images);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
