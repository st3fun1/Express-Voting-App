var express = require('express');
var app = express();
var ProfileRouter = express.Router();
var route = function () {
    ProfileRouter.route('/').get(function (req, res) {
        res.render('profile');
    });
    ProfileRouter.route(/deletePoll/).post(function (req,res) {
        
    });
    ProfileRouter.all(function(req,res){
       if(!req.user){
           res.redirect('back');
       }
    });
    return ProfileRouter;
}
module.exports = route;