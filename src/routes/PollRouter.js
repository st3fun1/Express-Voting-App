var express = require('express');
var app = express();
var mongodb = require('mongodb').MongoClient;
var PollRouter = express.Router();
var ObjectId = require('mongodb').ObjectID;
var route = function (dbAddress) {
    PollRouter.route('/').get(function (req, res) {
        var polls;
        mongodb.connect(dbAddress, function (err, db) {
            var pollsCollection = db.collection('polls');
            pollsCollection.find({}).toArray(function (err, results) {
                res.render('polls', {
                    polls: results
                });
            });
        });
    });
    PollRouter.route('/poll?').get(function (req, res) {
        var pollOwner = req.query.username;
        var pollTitle = encodeURIComponent(req.query.pollTitle);
        mongodb.connect(dbAddress, function (err, db) {
            var pollsCollection = db.collection('polls');
            pollsCollection.findOne({
                title: pollTitle
                , userId: pollOwner
            }, function (err, result) {
                if (result) {
                    //pass data into single-poll partial
                    //                   req.session.status = {
                    //                       statusCode: 200
                    //                   };
                    res.render('single-poll', {
                        options: result.options
                        ,title: decodeURIComponent(result.title),
                        ID: pollOwner
                    });
                }
                else {
                    res.redirect('back');
                }
            });
        });
    });
    PollRouter.route('/vote/:username/:pollTitle').post(function (req, res) {
        console.log(req.params.pollTitle);
        var pollOwner = req.params.username;
        var pollTitle = encodeURIComponent(req.params.pollTitle);
        var pollOption = req.body.option;
        console.log(pollOwner, pollTitle, pollOption);
        mongodb.connect(dbAddress, function (err, db) {
            var pollsCollection = db.collection('polls');
            pollsCollection.update({
                title: pollTitle
                ,userId: pollOwner,
                'options.name': pollOption 
            },
            {
                $inc: {
                    'options.$.votes': 1
                }
            }, function (err, result) {
                if (result) {
                    //pass data into single-poll partial
                    res.redirect('/polls');
                }
                else {
                    res.redirect('back');
                }
            });
        });
    });
    return PollRouter;
};
module.exports = route;