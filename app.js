var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var customerAccountsRouter = require('./routes/customer/accounts');
var adminAccountsRouter = require('./routes/admin/accounts');
var employeeAccountsRouter = require('./routes/employee/accounts');
var customerChangePasswordRouter = require('./routes/customer/changepassword');
var adminChangePasswordRouter = require('./routes/admin/changepassword');
var transactionHistoryRouter = require('./routes/customer/transactionhistory');
var loginRouter = require('./routes/login');
var transferRouter = require('./routes/customer/transfer');

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

app.use('/', indexRouter);
app.use('/customer/accounts', customerAccountsRouter);
app.use('/admin/accounts', adminAccountsRouter);
app.use('/employee/accounts', employeeAccountsRouter);
app.use('/customer/changepassword', customerChangePasswordRouter);
app.use('/admin/changepassword', adminChangePasswordRouter);
app.use('/customer/transactionhistory', transactionHistoryRouter);
app.use('/login', loginRouter);
app.use('/customer/transfer', transferRouter);

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
