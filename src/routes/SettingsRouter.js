var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var SettingsRouter = express.Router();
var ObjectID = require('mongodb').ObjectID;
var route = function (dbAddress,config) {
    var redirectMiddleware = function(req,res,next){
        if(!req.user){
           return res.redirect('/');
        }
        next();
    };
    SettingsRouter.use(redirectMiddleware);
    function renderRoute(routerObj,url,renderObj){
        
        return outerObj.route(url).get(function(req,res){
            res.render('index',renderObj);
        });
        
    }
    SettingsRouter.route('/account').get(function (req, res) {
        res.render('index',{
            partial: config.partials.accountSettings, 
            title: config.pageSettings.accountSettings.title,
            h2: config.pageSettings.accountSettings.h2,
            nav: config.pageSettings.nav,
            isLoggedIn: req.session.userLogged,
            username: req.user.username
        });
    });
    
    SettingsRouter.route('/account/edit/:username').post(function (req,res) {
        if(req.body.newPass !== req.body.newPassAgain){
                res.redirect('back');
        }else{
            mongodb.connect(dbAddress, function (err, db) {
            if (err) throw err;
            var collection = db.collection('users');
            collection.updateOne({username: req.params.username},{$set: {password: req.body.newPass}},function(err,result){

                if(err) throw err;
                    req.session.destroy(function (err) {
                        res.redirect('/');
                    });
                })
            });
        }
        
    }); 
    
    SettingsRouter.route('/polls').get(function (req, res) {
        mongodb.connect(dbAddress,function(err,db){
           if(err) throw err;
           var collection = db.collection('polls');
           collection.find({'user.id' : req.user._id}).toArray(function(err,docs){
              if(err) throw err;
               res.render('index',{
                    partial: config.partials.pollsSettings, 
                    title: config.pageSettings.pollsSettings.title,
                    h2: config.pageSettings.pollsSettings.h2,
                    nav: config.pageSettings.nav,
                    isLoggedIn: req.session.userLogged,
                    polls: docs
              });
           });
        });
    });
    
     SettingsRouter.route('/polls/poll?').get(function (req, res) {
        var username = req.query.username;
        var pollID = req.query.pollID;
        var jsonReq = req.query.json;
        console.log(req.params.title);
        mongodb.connect(dbAddress,function(err,db){
           if(err) throw err;
           var collection = db.collection('polls');
           collection.findOne({'user.username':username,_id:ObjectID(pollID)},function(err,poll){
                  console.log(poll);
                  if(err) throw err;
                  if(jsonReq == '1'){
                    return res.json({poll: poll})
                  }
                  return res.render('index',{
                        partial: config.partials.editPoll, 
                        title: config.pageSettings.pollsSettings.title,
                        h2: config.pageSettings.pollsSettings.h2,
                        nav: config.pageSettings.nav,
                        isLoggedIn: req.session.userLogged,
                        pollTitle: decodeURIComponent(poll.title),
                        scripts: config.pageSettings.editPoll.scripts,
                    }); 
           });
        });
    });
    
    /* To add global nav */

    
    
    SettingsRouter.route('/deletePolls').post(function (req,res) {
        
    });
    
    SettingsRouter.route('/addOption').post(function (req,res) {
        
    });  
    return SettingsRouter;
}
module.exports = route;