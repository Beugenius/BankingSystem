var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var indexRouter = require('./routes/index');
var customerAccountsRouter = require('./routes/customer/accounts');
var adminAccountsRouter = require('./routes/admin/accounts');
var employeeAccountsRouter = require('./routes/employee/accounts');
var customerChangePasswordRouter = require('./routes/customer/changepassword');
var adminChangePasswordRouter = require('./routes/admin/changepassword');
var transactionHistoryRouter = require('./routes/customer/transactionhistory');
var loginRouter = require('./routes/login');
var transferRouter = require('./routes/customer/transfer');
var accountsRouter = require('./routes/accounts');
var signupRouter = require('./routes/signup');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons')));
app.use(express.static(path.join(__dirname, "node_modules/crypto-js/")));

// this will setup the database if it doesn't already exist
var dbCon = require("./lib/database");
// Session management to store cookies in a mysql server (has bug, so we assist by creating the database for it)
var dbSessionPool = require("./lib/sessionPool");
var sessionStore = new MySQLStore({}, dbSessionPool);
// necessary middleware to store session cookies in mysql
app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret1234",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "strict",
    },
  })
);

// middleware to make session variables available in .ejs template files 
app.use((req, res, next) => {
  res.locals.session = req.session; 
  next();
});

app.use('/', indexRouter);
app.use('/customer/accounts', customerAccountsRouter);
app.use('/admin/accounts', adminAccountsRouter);
app.use('/employee/accounts', employeeAccountsRouter);
app.use('/customer/changepassword', customerChangePasswordRouter);
app.use('/admin/changepassword', adminChangePasswordRouter);
app.use('/customer/transactionhistory', transactionHistoryRouter);
app.use('/login', loginRouter);
app.use('/customer/transfer', transferRouter);
app.use('/accounts', accountsRouter);
app.use('/signup', signupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
