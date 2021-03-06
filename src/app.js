const express = require('express');
const session = require('express-session');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const logoutRouter = require('./routes/logout');
const sessionRouter = require('./routes/session');

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

mongoose.connect(url);

const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: 'secret', //process.env.SESSION_SECRET ||
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'sessions',
    }),
    cookie: {
      maxAge: 86400000,
      secure: false,
    },
  })
);

app.use(cors({credentials: true, origin: true}));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/logout', logoutRouter);
app.use('/session', sessionRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
