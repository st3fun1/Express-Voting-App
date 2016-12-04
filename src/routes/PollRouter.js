var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var PollRouter = express.Router();
var ObjectId = require('mongodb').ObjectID;
var PollController = require('../controllers/Poll.Controller');
var route = function (dbAddress,config) {
    
    var renderContentMiddleware = function(req,res,next){
        var viewObj;
//        console.log('REQ: ',  req.path);
        if(req.path == '/'){
            res.locals.viewData = {
                    partial: config.partials.polls, 
                    title: config.pageSettings.polls.title,
                    h2: config.pageSettings.polls.h2,
                };
        } else if(req.path = '/poll?'){
            res.locals.viewData = {
                partial: config.partials.singlePoll, 
                title: config.pageSettings.singlePoll.title,
                h2: config.pageSettings.singlePoll.h2,
                scripts: config.pageSettings.singlePoll.scripts
            }
        }
        next();
    };
    PollRouter.use(renderContentMiddleware);
    
    PollRouter.route('/').get(PollController.showAll);
    PollRouter.route('/poll?').get(PollController.showOne);
    /* Increment votes for a single poll */
    PollRouter.route('/vote/:username/:pollTitle').post(PollController.vote);
    PollRouter.route('/getPoll?').get(PollController.getPollAPI);
    
    return PollRouter;
};
module.exports = route;