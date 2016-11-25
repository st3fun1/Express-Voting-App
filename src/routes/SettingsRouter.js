var express = require('express');
var app = express();
var SettingsRouter = express.Router();
var route = function (dbAddress,config) {
    SettingsRouter.route('/').get(function (req, res) {
        res.render('index',{
        partial: config.partials.mainPage, 
        title: config.pageSettings.main.title,
        h2: config.pageSettings.main.h2,
        nav: config.pageSettings.nav,
        isLoggedIn: req.session.userLogged
    });
    });
    
    SettingsRouter.route(/deletePolls/).post(function (req,res) {
        
    });
    
    SettingsRouter.route(/editPolls/).post(function (req,res) {
        
    });
    
    SettingsRouter.route(/changePassword/).post(function (req,res) {
        
    });
    
    SettingsRouter.all(function(req,res){
       if(!req.user){
           res.redirect('back');
       }
    });
    
    console.log(SettingsRouter);
    return SettingsRouter;
}
module.exports = route;