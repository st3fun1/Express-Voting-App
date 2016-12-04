var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/voting-app');

var userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

var User = mongoose.model('users',userSchema);
module.exports = User;

