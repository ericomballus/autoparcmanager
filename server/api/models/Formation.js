const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const FormationSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
});
module.exports = mongoose.model("Formation", FormationSchema);
