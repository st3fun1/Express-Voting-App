var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose
  .connect(process.env.MONGO_ADDRESS, { autoIndex: false })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("DB error: ", err);
  });

var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

var User = mongoose.model("users", userSchema);
module.exports = User;
