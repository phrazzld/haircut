// haircut/src/auth.js

// Set up authentication
const passport = require('passport');
const config = require('@root/config');
const db = require('@root/db');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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
  return done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log(`passport.deserializeUser`);
  try {
    db.getUser(id).then(user => {
      return done(null, user);
    });
  } catch (err) {
    console.error(err);
    return done(err, null);
  }
});

const check = (req, res, next) => {
  if (req.user != null) return next();
  return res.status(401).redirect('/error/401');
};

module.exports = {
  check,
  withLinkedIn: passport.authenticate('linkedin'),
  linkedInCallbackHandler: passport.authenticate('linkedin', {
    successRedirect: '/account',
    failureRedirect: '/error/500',
    failureFlash: true,
  }),
};
