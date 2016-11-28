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
            username: req.user.username,
            path: req.path
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
                    polls: docs
              });
           });
        });
    });
    
     SettingsRouter.route('/polls/poll?').get(function (req, res) {
        var username = req.query.username;
        var pollID = req.query.pollID;
        var jsonReq = req.query.json;
        //condition for checking if the poll is in db
         //else redirect home
        console.log(ObjectID.isValid(pollID));
        console.log(ObjectID.isValid('231312'));
        if(ObjectID.isValid(pollID) && username == req.user.username){
            mongodb.connect(dbAddress,function(err,db){
            if(err) throw err;
            var collection = db.collection('polls');
                collection.findOne({'user.username':username,_id:ObjectID(pollID)},function(err,poll){
                      console.log(poll);
                      if(err) return res.redirect('back');
                      else return res.render('index',{
                            partial: config.partials.editPoll, 
                            title: config.pageSettings.pollsSettings.title,
                            h2: config.pageSettings.pollsSettings.h2,
                            pollTitle: decodeURIComponent(poll.title),
                            pollID: poll._id,
                            scripts: config.pageSettings.editPoll.scripts,
                        }); 
                      if(jsonReq == '1'){
                        return res.json({poll: poll})
                      }
               });
           });
            
        } else {
            return res.redirect('/');
        }
       
    });
    
    SettingsRouter.route('/polls/:id/delete').post(function (req,res) {
        var pollID = req.params.id;
        console.log('pollID: ', pollID, typeof pollID);
        if(mongodb.BSONPure.ObjectID.isValid(pollID)){
           mongodb.connect(dbAddress,function(err,db){
               if(err) res.redirect('back');
               var collection = db.collection('polls');
                   collection.remove({_id: ObjectID(pollID)},function(err,result){
                       if(err) throw err;
                       if(result){
                           return res.redirect('/polls');
                       }  
                   })
           }); 
        }else{
            res.redirect('back');                                    
        }
      
    });
    /* To add global nav */
    return SettingsRouter;
}
module.exports = route;