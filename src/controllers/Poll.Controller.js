var Poll = require('../models/Poll.Model');

/* Show all the polls on polls page */
exports.showAll = function (req, res) {
    
    Poll.find({}).exec(function (err, results) {
        return res.render('index',{
            results: results
        });
    });
};

/* Show details of one poll */
exports.showOne = function (req, res) {
    var pollOwner = req.query.username;
    var pollTitle = encodeURIComponent(req.query.pollTitle);
    Poll.findOne({title: pollTitle, 'user.username': pollOwner})
        .exec(function (err, result) {
            if (result) {
                //pass data into single-poll partial
                return res.render('index',{
                    options: result.options
                    ,pollTitle: decodeURIComponent(result.title)
                    ,pollOwner: pollOwner
                });
            } else {
                return res.redirect('back');
            }
        });
};


exports.vote = function (req, res) {
        var pollOwner = req.params.username;
        var pollTitle = encodeURIComponent(req.params.pollTitle);
        var pollOption = req.body.option;
        Poll.findOneAndUpdate({title: pollTitle,'user.username': pollOwner,'options.name': pollOption},
            {
                $inc: {
                    'options.$.votes': 1
                }
            },
            function (err,result) {
                if (result) {
                        var responseObj = {
                            message: 'Update completed succesfully!',
                            poll: {
                                title: result.title,
                                options: result.options
                            }
                        };
                            return res.json(responseObj);
                }
                else {
                        return res.json({'message':'Failed to update data!'});
                }
            });
};

/* send json response for updating a poll for ajax request */
exports.getPollAPI = function (req, res) {
    
    var pollOwner = req.query.username;
    var pollTitle = req.query.pollTitle

    Poll.findOne({title: pollTitle,'user.username': pollOwner})
        .exec(function (err,result) {
            if(result){
                var responseObj = {
                        message: 'Update completed succesfully!',
                        poll:{
                                title: result.title,
                                options: result.options
                            }
                };
                res.json(responseObj);
            }else{
                res.json({'message':'Failed to update data!'});
            }
        });
};