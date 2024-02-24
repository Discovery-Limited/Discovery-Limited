import { use, serializeUser, deserializeUser } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

GOOGLE_CLIENT_ID = '15203078856-u0p12011dkvm9umtere0kcg7csgj24dg.apps.googleusercontent.com';
GOOGLE_CLIENT_SECRET = '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';

use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

serializeUser(function(user, done) {
  done(null, user);
});

deserializeUser(function(user, done) {
  done(null, user);
});