var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var pollSchema = new Schema({
    user: {
        id: {type: String, required:true},
        username: {type: String, required:true}
    },
    title: {type: String, required:true},
    options:[
        {
            name: String,
            votes: Number
        }
    ]
});

var Poll = mongoose.model('polls', pollSchema);
module.exports = Poll;