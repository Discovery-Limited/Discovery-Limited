const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

GOOGLE_CLIENT_ID = '15203078856-u0p12011dkvm9umtere0kcg7csgj24dg.apps.googleusercontent.com';
GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});