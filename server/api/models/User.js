const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
  name: String,
  password: String,
  created: { type: Date, default: Date.now },
  telephone: { type: Number, default: 0000 },
});

module.exports = mongoose.model("User", userSchema);
