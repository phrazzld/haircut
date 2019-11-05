// haircut/src/app.js

const express = require('express');
const app = express();
require('dotenv').config();
const helmet = require('helmet');
const config = require('@root/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const routes = require('@routes/index');

// Always wear a helmet
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(flash());
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  }),
);

// Config authentication
const auth = require('@root/auth');
app.use(passport.initialize());
app.use(passport.session());

// Set up our views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Set up our static files
app.use(express.static(__dirname + '/public'));

// Ensure https requests in production
if (config.isProd) {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use('/', routes);

module.exports = app;
