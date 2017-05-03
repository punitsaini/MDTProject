//Code based on: https://www.slideshare.net/pgodby/ibm-watson-conversation-nodejs
//


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var conv = require('./routes/conv');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', conv);
app.get('/', function(req, res) {
	console.log("In GET*********************")
	 console.log(req.body.input)
});

app.post('/', function(req, res) {
	console.log("In POST*********************")
	console.log(req.body.input)
});


app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  console.log("Reached the Application but failed************************")
  console.log(bodyParser.json())
  console.log("Reached the Application but failed************************")
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
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
// start server on the specified port and binding host
//app.listen(appEnv.port, '0.0.0.0', function() {
   //print a message when the server starts listening
  //console.log("server starting on " + appEnv.url);
//});
console.log("server starting on " + appEnv.url)
module.exports = app;
