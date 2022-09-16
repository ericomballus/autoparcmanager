const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const MarqueVehiculeSchema = new Schema({
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
});
module.exports = mongoose.model("MarqueVehicule", MarqueVehiculeSchema);
