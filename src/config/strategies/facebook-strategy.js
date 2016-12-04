var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var mongodb = require('mongodb').MongoClient;
var dbAddress = 'mongodb://localhost:27017/voting-app';
module.exports = function () {
    passport.use(new FacebookStrategy({
            clientID: '327248027658756'
            , clientSecret: 'eaa02e889c0a93ca6441fbdab8803cf6'
            , callbackURL: 'http://localhost:3000/auth/facebook/callback'
        }
        , //facebook will send back the token and profile                              
        function (token, refreshToken, profile, done) {
            //async
            process.nextTick(function () {
                mongodb.connect(dbAddress, function (err, db) {
                    var collection = db.collection('facebookUsers');
                    collection.findOne({
                        'facebook.id': profile.id
                    }, function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            return done(null, user);
                        }
                        else {
                            collection.insertOne({
                                'facebook.id': profile.id
                                , token: token
                                , 'facebook.name': profile.name
                                , 'facebook.email': profile.email
                            }, function (err, newUser) {
                                console.log('newUSer:', newUSer);
                                return done(null, newUser)
                            })
                        }
                    });
                });
            });
        }));
}