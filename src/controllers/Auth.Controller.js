var passport = require('passport');
var User = require('../models/User.Model');
var Poll = require('../models/Poll.Model');

exports.registerReq = function (req, res) {
        if (req.user) return res.redirect('/');
        return res.render('index');
};

exports.registerNew = function (req, res) {
        if (req.body.password !== req.body.passwordAgain) {
            return res.redirect('back');
        }
        else {
            var user = {
                username: req.body.username
                , password: req.body.password
                , name: req.body.name
                , email: req.body.email
            };
            User.findOne({
                    $or: [{
                        username: user.username
                    }, {
                        email: user.email
                    }]
            },function(err,result){
                console.log(result);
                 if (result) {
                        return res.redirect('back');
                    }
                    else {
                        var newUser = new User(user);
                        newUser.save(function(err,data){
                            if(err) console.log(err);
                            console.log(data);
                            req.login(data, function () {
                                return res.redirect('/auth/profile');
                            });
                        });
                    }
            });
       }
};

exports.loginReq = function (req, res) {
        if (req.user) return res.redirect('/');
        return res.render('index');
};

exports.loginNow = passport.authenticate('local', {
          successRedirect: '/auth/profile'
        , failureRedirect: 'back'
        , failureFlash: true
});

exports.facebook = passport.authenticate('facebook',{
       scope: 'email' 
});

exports.facebookCallback = passport.authenticate('facebook',{
       successRedirect: '/profile',
       failureRedirect: 'back',
});

exports.profile = function (req, res) {
    
    if (!req.user) {
        return res.redirect('/');
    }
    else {
        res.render('index', {
            username: req.user.username
        });
    }
};

exports.logout = function (req, res) {
    
    req.session.destroy(function (err) {
        res.redirect('/');
    });
    
};

exports.profileAddPoll = function (req, res) {
        console.log(req.user);
        var options = [];
        for (var item in req.body) {
            if (item.match(/option/)) {
                options.push({
                    name: req.body[item]
                    , votes: 0
                });
            }
        };
        var poll = new Poll({
            user: {
                id: req.user._id
                , username: req.user.username
            }
            , title: encodeURIComponent(req.body.title)
            , options: options
        });
      //add each option to options array starting from   req.body.option1
        poll.save(function(err,results){
            if(results){
                  res.redirect(`/polls/poll?username=${req.user.username}&pollTitle=${req.body.title}`);
            } else {
                 res.redirect('back');
            }
        });
};

exports.profileNotLogged = function (req, res) {
    if (!req.user) res.redirect('/');
};

exports.changePassword = function (req, res) {
    if (req.body.password == req.body.passwordAgain) {
        User.update({
            _id: new ObjectId(`${req.user._id}`)
        }, {
            $set: {
                password: req.body.password
            }
        }, function (err, result) {
            console.log(result);
            res.redirect('/auth/profile');
        });
    }
    else {
        res.redirect('/');
    }
};