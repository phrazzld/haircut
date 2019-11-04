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
