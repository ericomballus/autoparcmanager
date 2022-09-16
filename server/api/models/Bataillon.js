const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const BataillonSchema = new Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brigade",
    required: true,
  },
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
});
module.exports = mongoose.model("Bataillon", BataillonSchema);
