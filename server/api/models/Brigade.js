const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const BrigadeSchema = new Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rmia",
    default: null,
  },
  armyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Armee",
    default: null,
  },
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
});
module.exports = mongoose.model("Brigade", BrigadeSchema);
