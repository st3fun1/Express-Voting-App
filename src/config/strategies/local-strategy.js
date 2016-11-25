var passport = require('passport');
var dbAddress = 'mongodb://localhost:27017/voting-app'; 
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb').MongoClient;
module.exports = function () {
    passport.use(new LocalStrategy({
        usernameField: 'username'
        , passwordField: 'password'
    },function (username, password, done) {
        mongodb.connect(dbAddress, function (err, db) {
            var collection = db.collection('users');
            collection.findOne({
                username: username
            }, function (err, user) {
                if (err) return done(err);
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username!'
                    });
                }
                if (user.username !== username) {
                    return done(null, false, {
                        message: 'Incorrect password!'
                    });
                }
                return done(null, user);
            });
        });
    }));
}