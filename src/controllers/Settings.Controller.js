var ObjectID = require('mongodb').ObjectID;
var User = require('../models/User.Model');
var Poll = require('../models/Poll.Model');

exports.accountReq = function (req, res) {
    res.render('index',{
        username: req.user.username,
        path: req.path
    });
};

exports.editAccount = function (req,res) {
    
    if(req.body.newPass !== req.body.newPassAgain){
            res.redirect('back');
    }else{
        User.findOneAndUpdate(
            {username: req.params.username},
            {$set: {password: req.body.newPass}},function(err,result){
                 console.log(result)
            if(err) throw err;
            req.session.destroy(function (err) {
                return res.redirect('/');
            });
        })
    }
       
};

exports.showUserSPolls = function (req, res) {
    
       Poll.find({'user.id' : req.user._id}).exec(function(err,docs){
          if(err) throw err;
          console.log('docs',docs);
          if(docs.length > 0) {
            res.render( 'index', {polls: docs});
          } else {
            res.render( 'index', {message: 'You have no polls yet'})
          }
       });
};

exports.showOne = function (req, res) {
    
    var username = req.query.username;
    var pollID = req.query.pollID;
    var jsonReq = req.query.json;
    //condition for checking if the poll is in db
     //else redirect home
    if(ObjectID.isValid(pollID) && username == req.user.username){
        Poll.findOne({'user.username':username,_id:ObjectID(pollID)})
            .exec(function(err,poll){
                   if(err) return res.redirect('back');
                   if(jsonReq == 1){
                      return res.json({poll: poll})
                   }

                  else return res.render('index',{
                        pollTitle: decodeURIComponent(poll.title),
                        pollID: poll._id,
                        pollOptions: poll.options
                  });
           });
    } else {
        return res.redirect('/');
    }     
};

exports.deletePoll = function (req,res) {
    var pollID = req.params.id;
  /*  console.log('pollID: ', pollID, typeof pollID);*/
    if(pollID.match(/^[a-fA-F0-9]{24}$/)){
        
       Poll.find({_id: ObjectID(pollID)})
           .remove()
           .exec(function(err,result){
               if(err) return res.redirect('back');
               if(result){
                   return res.redirect('/polls');
               }  
            });
        
    }else{
        res.redirect('back');                                    
    }  
};

exports.updatePoll = function (req,res) {
    
    var pollID = req.params.id;
    if(pollID.match(/^[a-fA-F0-9]{24}$/)){

        var optionsArr = [];
        for(var option in req.body){
            
            optionsArr.push({name: req.body[option],votes: 0}); 
            
        }
           Poll.update({_id:  ObjectID(pollID)},
                          {
                           $addToSet:{
                                   options:  {
                                       $each : optionsArr
                                   }
                                           }
                           }, function(err,result){
                               if(err) return res.json({message:'Update failed!'});
                                res.json({message: 'Update succesful!'});
                           });
    } else {
        return res.redirect('/');
    }
};