var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var SettingsRouter = express.Router();
var route = function (dbAddress,config) {
    var redirectMiddleware = function(req,res,next){
       if(!req.user){
           res.redirect('/');
       }
         next();
    };
    SettingsRouter.use(redirectMiddleware);
//    function renderRoute(routerObj,url,renderObj){
//        
//        return outerObj.route(url).get(function(req,res){
//            res.render('index',renderObj);
//        });
//        
//    }
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
        console.log(req.params.username);
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
        res.render('index',{
            partial: config.partials.pollsSettings, 
            title: config.pageSettings.pollsSettings.title,
            h2: config.pageSettings.pollsSettings.h2,
            nav: config.pageSettings.nav,
            isLoggedIn: req.session.userLogged
        });
    });
    
    /* To add global nav */

    
    
    SettingsRouter.route('/deletePolls/').post(function (req,res) {
        
    });
    
    SettingsRouter.route('/editPolls/').post(function (req,res) {
        
    });
    
    SettingsRouter.route('/changePassword/').post(function (req,res) {
        
    });
    
    console.log(SettingsRouter);
    return SettingsRouter;
}
module.exports = route;