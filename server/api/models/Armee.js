const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ArmeeSchema = new Schema({
  /* parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rmia",
    required: true,
  },*/
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
});
module.exports = mongoose.model("Armee", ArmeeSchema);
