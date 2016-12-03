var express = require('express');
var app = express();
var controller = require('../controllers/HomePage.Controller');
var HomePageRouter = express.Router();

var route = function() {
    
    HomePageRouter.route('/').get(controller.index);
    return HomePageRouter;  
}

module.exports = route;