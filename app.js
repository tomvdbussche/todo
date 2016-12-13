import express from "express";
import path from "path";
import logger from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import indexRouter from "./routes/index";
import apiRouter from "./routes/api";
import usersRouter from "./routes/users";
import listModel from "./models/list";
import taskModel from "./models/task";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bluebird from "bluebird";

// Add promises to mongoose
mongoose.Promise = bluebird;

// Try to retrieve settings from .env
dotenv.config();

let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || null;
let dbName = process.env.DB_NAME || 'todo';
let dbUser = process.env.DB_USER || null;
let dbPass = process.env.DB_PASS || null;

// Build mongodb URL
let dbUrl = 'mongodb://';

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

let app = express();

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
    let err = new Error('Not Found');
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
