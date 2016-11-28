var express = require('express');
var app = express();
var mongodb = require('mongodb');
var passport = require('passport');
var flash = require('connect-flash');
var AuthRouter = express.Router();
var ObjectId = require('mongodb').ObjectID;
var route = function (dbAddress,config) {
    
    AuthRouter.route('/register').get(function (req, res) {
        if (req.user) res.redirect('/');
        res.render('index', {
            partial: config.partials.register, 
            title: config.pageSettings.register.title,
            h2: config.pageSettings.register.h2,
            isLoggedIn: req.session.userLogged
        });
    });
    
    AuthRouter.route('/register/new').post(function (req, res) {
        if(req.body.password !== req.body.passwordAgain){
                res.redirect('back');
        }else{
            mongodb.connect(dbAddress, function (err, db) {
            if (err) throw err;
            var user = {
                 username: req.body.username
                ,password: req.body.password
                ,name: req.body.name
                ,email: req.body.email
            };
            var collection = db.collection('users');
            collection.findOne({$or: [{username: user.username},{email: user.email}]},function (err,result) {
                if(result){
                    res.redirect('back');
                }else{
                    collection.insertOne(user, function (err, results) {
                        req.login(results.ops[0], function () {
                            res.redirect('/auth/profile');
                        });
                    });
                }
            });
        });
        }
        
    });
    
    AuthRouter.route('/login').get(function (req, res) {
        if (req.user) res.redirect('/');
        res.render('index', {
            partial: config.partials.login, 
            title: config.pageSettings.login.title,
            h2: config.pageSettings.login.h2,
            isLoggedIn: req.session.userLogged
        });
    });
    
    AuthRouter.route('/login/now').post(passport.authenticate('local',{
        successRedirect: '/auth/profile',
        failureRedirect: 'back',
        failureFlash: true
    }));
    
    AuthRouter.route('/profile').get(function (req, res) {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            req.session.userLogged = 1;
            res.render('index', {
                partial: config.partials.profile, 
                title: config.pageSettings.profile.title,
                h2: config.pageSettings.profile.h2,
                isLoggedIn: req.session.userLogged,
                username: req.user.username
            });
        }
    });
    
    AuthRouter.route('/logout').get(function (req,res){
        req.session.destroy(function (err) {
            res.redirect('/');
         });
    }); 
    
    AuthRouter.route('/profile/addPoll').post(function (req, res) {
        mongodb.connect(dbAddress, function (err, db) {
            var options = [];
            for(var item in req.body){
                if(item.match(/option/)){
                    options.push({name: req.body[item], votes:0});
                }
            }
            var collection = db.collection('polls');
            //add each option to options array starting from req.body.option1
               collection.insertOne({
                      user: {
                          id: req.user._id,
                          username: req.user.username
                      }
                    , title: encodeURIComponent(req.body.title)
                    , options: options
                }
                , function (err, result) {
                if(result.ops !== undefined ){
                    res.redirect(`/polls/poll?username=${req.user.username}&pollTitle=${req.body.title}`);
                }else{
                    res.redirect('back');
                }
                
            });
    });
        
    }).all(function(req,res){
        if(req.user == undefined) res.redirect('/');
    });
    
/*    AuthRouter.route('/profile/settings').get(function (req, res) {
        if (!req.user) {
            res.redirect('/');
        }
        else {
            res.render('index',{
                partial: config.partials.settings, 
                title: config.pageSettings.settings.title,
                h2: config.pageSettings.settings.h2,
                nav: config.pageSettings.nav,
                isLoggedIn: req.session.userLogged
            });
        }
    });*/
    
    AuthRouter.route('/profile/settings/change-password').post(function (req, res) {
        mongodb.connect(dbAddress, function (err, db) {
            var collection = db.collection('users');
            if (req.body.password == req.body.passwordAgain) {
                collection.update({
                    _id: new ObjectId(`${req.user._id}`)
                }, {
                    $set: {
                        password: req.body.password
                    }
                }, function (err, result) {
                    res.redirect('/auth/profile');
                });
            }
            else {
                res.redirect('/');
            }
        });
    });
    
    return AuthRouter;
}
module.exports = route;