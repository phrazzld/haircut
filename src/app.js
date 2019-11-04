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
const db = require('@root/db');

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

// Set up authentication
const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LinkedInStrategy(
    {
      clientID: config.linkedInKey,
      clientSecret: config.linkedInSecret,
      callbackURL: config.linkedInCallbackURL,
      profileFields: [
        'first-name',
        'last-name',
        'email-address',
        'headline',
        'summary',
        'industry',
        'picture-url',
        'positions',
        'public-profile-url',
        'location',
      ],
      scope: ['r_emailaddress', 'r_liteprofile'],
      state: true,
      passReqToCallback: true,
    },
    async function(req, accessToken, refreshToken, profile, done) {
      process.nextTick(async function() {
        console.log(`new LinkedInStrategy::callback:process.nextTick`);
        try {
          await db.createUser(JSON.stringify(profile));
          const user = {
            id: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          };
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log('passport.serializeUser');
  console.log(`user.id: ${user.id}`);
  return done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log(`passport.deserializeUser::id: ${id}`);
  try {
    db.getUser(id).then(user => {
      return done(null, user);
    });
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
});

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

app.get('/', (req, res) => {
  console.log('GET /home');
  res.render('home', {
    title: 'Haircut',
  });
});

app.get('/login', (req, res) => {
  console.log('GET /login');
  res.render('login', {
    title: 'Login',
  });
});

app.get('/logout', (req, res) => {
  console.log('GET /logout');
  req.logout();
  res.redirect('/');
});

app.get('/account', async (req, res) => {
  console.log('GET /account');
  console.log('req.user');
  console.log(req.user);
  res.render('account', {
    title: 'Account',
    name: req.user.displayName,
  });
});

app.get('/auth/linkedin', passport.authenticate('linkedin'), (req, res) => {
  console.log('GET /auth/linkedin');
});

app.get(
  '/auth/linkedin/callback',
  passport.authenticate('linkedin', {
    successRedirect: '/account',
    failureRedirect: '/login',
    failureFlash: true,
  }),
);

module.exports = app;
