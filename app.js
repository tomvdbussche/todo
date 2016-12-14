var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var usersRouter = require("./routes/users");
var listModel = require("./models/list");
var taskModel = require("./models/task");
var mongoose = require("mongoose");
var dotenv = require("dotenv");
var bluebird = require("bluebird");

// Add promises to mongoose
mongoose.Promise = bluebird;

// Try to retrieve settings from .env
dotenv.config();

var dbHost = process.env.DB_HOST || 'localhost';
var dbPort = process.env.DB_PORT || null;
var dbName = process.env.DB_NAME || 'todo';
var dbUser = process.env.DB_USER || null;
var dbPass = process.env.DB_PASS || null;

// Build mongodb URL
var dbUrl = 'mongodb://';

// Append user & password if needed
if (dbUser !== null && dbPass !== null) {
    dbUrl += dbUser + ':' + dbPass + '@';
}

// Append host
dbUrl += dbHost;

// Append port if set
if (dbPort !== null) {
    dbUrl += ':' + dbPort;
}

// Append name
dbUrl += '/' + dbName;

// Connect to database
mongoose.connect(dbUrl);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
