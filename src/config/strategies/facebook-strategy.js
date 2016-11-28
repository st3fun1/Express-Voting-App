var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return'
}));