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
    
    var renderContentMiddleware = function (req, res, next) {
        if(req.path == '/account'){
            res.locals.viewData = {
                partial: config.partials.accountSettings, 
                title: config.pageSettings.accountSettings.title,
                h2: config.pageSettings.accountSettings.h2
            };
        } else if(req.path == '/polls'){
            res.locals.viewData = {
                partial: config.partials.pollsSettings, 
                title: config.pageSettings.pollsSettings.title,
                h2: config.pageSettings.pollsSettings.h2
            }
        } else if(req.path == '/polls/poll'){
            res.locals.viewData = {
                 partial: config.partials.editPoll, 
                 title: config.pageSettings.pollsSettings.title,
                 h2: config.pageSettings.pollsSettings.h2,
                 scripts: config.pageSettings.editPoll.scripts
            }
        }
        next();
    };
    
    SettingsRouter.use(redirectMiddleware);
    SettingsRouter.use(renderContentMiddleware);
    
    
    SettingsRouter.route('/account').get(function (req, res) {
        res.render('index',{
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
        if(ObjectID.isValid(pollID) && username == req.user.username){
            mongodb.connect(dbAddress,function(err,db){
            if(err) throw err;
            var collection = db.collection('polls');
            collection.findOne({'user.username':username,_id:ObjectID(pollID)},function(err,poll){
                      /*console.log(poll);*/
                       if(err) return res.redirect('back');
                       if(jsonReq == 1){
                        /*console.log('json chart request');*/
                        return res.json({poll: poll})
                      }
                      
                      else return res.render('index',{
                            pollTitle: decodeURIComponent(poll.title),
                            pollID: poll._id,
                            pollOptions: poll.options
                      });
               });
           });
            
        } else {
            return res.redirect('/');
        }
       
    });
    
    SettingsRouter.route('/polls/:id/delete').post(function (req,res) {
        var pollID = req.params.id;
      /*  console.log('pollID: ', pollID, typeof pollID);*/
        if(pollID.match(/^[a-fA-F0-9]{24}$/)){
           mongodb.connect(dbAddress,function(err,db){
               if(err) res.redirect('back');
               var collection = db.collection('polls');
                   collection.remove({_id: ObjectID(pollID)},function(err,result){
                       if(err) return res.redirect('back');
                       if(result){
                           return res.redirect('/polls');
                       }  
                   })
           }); 
        }else{
            res.redirect('back');                                    
        }
      
    });
    
    SettingsRouter.route('/polls/:id/update').post(function (req,res) {
        console.log(req.body);
        var pollID = req.params.id;
        if(pollID.match(/^[a-fA-F0-9]{24}$/)){
            
            var optionsArr = [];
            for(var option in req.body){
                    optionsArr.push({
                    name: req.body[option],
                    votes: 0
                   }); 
            }
            
            mongodb.connect(dbAddress, function(err, db){
               if(err) return res.redirect('/');
               var collection = db.collection('polls');
               collection.updateOne({
                   _id:  ObjectID(pollID)
               },{
                   $addToSet:{
                           options:  {
                               $each : optionsArr
                           }
                   }
               }, function(err,result){
                   if(err) return res.json({message:'Update failed!'});
                    res.json({message: 'Update succesful!'});
               });
            });
        }
    });
    
    /* To add global nav */
    return SettingsRouter;
}
module.exports = route;