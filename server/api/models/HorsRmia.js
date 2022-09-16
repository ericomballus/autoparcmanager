const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const HorsRmiaSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
  central: { type: Boolean, default: false, required: true }, //administration central ou nom
});
module.exports = mongoose.model("HorsRmia", HorsRmiaSchema);
