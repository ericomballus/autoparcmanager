const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const VehiculeSchema = new Schema({
  horsrmiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HorsRmia",
    default: null,
  },
  rmiaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rmia",
    default: null,
  },
  brigadeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brigade",
    default: null,
  },
  bataillonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bataillon",
    default: null,
  },
  compagnieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Compagnie",
    default: null,
  },
  admincentralId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminCentral",
    default: null,
  },
  created: { type: Date, default: Date.now },
  name: { type: String, default: " ", required: true },
  marque: { type: String, default: " ", required: true },
  typeVehicule: { type: String, default: " ", required: true },
  numeroChassis: { type: String, default: " ", required: true },
  nouvelleImmatriculation: { type: String, default: " ", required: true },
  ancienneImmatriculation: { type: String, default: " " },
  anneeDeMiseEnService: { type: Number, default: null },
  moisDeMiseEnService: { type: Number, default: null },
  jourDeMiseEnService: { type: Number, default: null },
  observation: { type: String, default: " " },
  utilisateur: { type: String },
});
module.exports = mongoose.model("Vehicule", VehiculeSchema);
