var express = require('express');
var app = express();
var SettingsRouter = express.Router();
var SettingsController = require('../controllers/Settings.Controller');
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
    
    
    SettingsRouter.route('/account').get(SettingsController.accountReq);
    
    SettingsRouter.route('/account/edit/:username').post(SettingsController.editAccount); 
    
    SettingsRouter.route('/polls').get(SettingsController.showUserSPolls);
    
     SettingsRouter.route('/polls/poll?').get(SettingsController.showOne);
    
    SettingsRouter.route('/polls/:id/delete').post(SettingsController.deletePoll);
    
    SettingsRouter.route('/polls/:id/update').post(SettingsController.updatePoll);
    
    /* To add global nav */
    return SettingsRouter;
}
module.exports = route;