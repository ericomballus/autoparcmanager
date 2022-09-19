const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const EmployeSchema = new Schema({
  gradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
    default: null,
  },
  formationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
    default: null,
  },
  metierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Metier",
    default: null,
  },

  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
  matricule: { type: String, default: " ", required: true },
  telephone: { type: String, default: "0000000", required: true },
});
module.exports = mongoose.model("EmployeMilitaire", EmployeSchema);
