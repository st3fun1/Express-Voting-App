var express = require('express');
var app = express();
var mongodb = require('mongodb');
var passport = require('passport');
var flash = require('connect-flash');
var AuthRouter = express.Router();
var ObjectId = require('mongodb').ObjectID;
var AuthController = require('../controllers/Auth.Controller');
var route = function (dbAddress, config) {
    
    var renderContentMiddleware = function (req, res, next) {
        
//        console.log('REQ path AUTH: ', req.path);
        if (req.path == '/register') {
            res.locals.viewData = {
                partial: config.partials.register
                , title: config.pageSettings.register.title
                , h2: config.pageSettings.register.h2
            };
        }
        else if (req.path == '/login') {
            res.locals.viewData = {
                partial: config.partials.login
                , title: config.pageSettings.login.title
                , h2: config.pageSettings.login.h2
            };
        }
        else if (req.path == '/profile') {
            res.locals.viewData = {
                partial: config.partials.profile
                , title: config.pageSettings.profile.title
                , h2: config.pageSettings.profile.h2
            };
        }
        next();
    };
    
    
    AuthRouter.use(renderContentMiddleware);
    
    AuthRouter.route('/register').get(AuthController.registerReq);
    
    AuthRouter.route('/register/new').post(AuthController.registerNew);
    
    AuthRouter.route('/login').get(AuthController.loginReq);
    
    AuthRouter.route('/login/now').post(AuthController.loginNow);
    
    AuthRouter.route('/facebook').get(AuthController.facebook);
    
    AuthRouter.route('/facebook/callback').get(AuthController.facebookCallback);
    
    AuthRouter.route('/profile').get(AuthController.profile);
    AuthRouter.route('/logout').get(AuthController.logout);
    AuthRouter.route('/profile/addPoll').post(AuthController.profileAddPoll).all(AuthController.profileNotLogged);
    
    AuthRouter.route('/profile/settings/change-password').post(AuthController.changePassword);
    
    return AuthRouter;
}
module.exports = route;