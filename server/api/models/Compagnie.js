const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CompagnieSchema = new Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bataillon",
    required: true,
  },
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
});
module.exports = mongoose.model("Compagnie", CompagnieSchema);
