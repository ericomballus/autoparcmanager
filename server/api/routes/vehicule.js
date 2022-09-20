const express = require("express");
const mongoose = require("mongoose");
const Vehicule = require("../models/Vehicule");
const router = express.Router();
let io = require("socket.io");

router.post("/", async (req, res, next) => {
  try {
    let found = await Vehicule.find({
      $or: [
        { numeroChassis: req.body.numeroChassis },
        { nouvelleImmatriculation: req.body.nouvelleImmatriculation },
        { ancienneImmatriculation: req.body.ancienneImmatriculation },
      ],
    });
    if (found && found.length) {
      res.status(402).json(found[0]);
    } else {
      const doc = new Vehicule(req.body);
      const vehicule = await doc.save();
      req.io.sockets.emit(`vehicule`, vehicule);
      res.status(201).json(vehicule);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res, next) => {
  let page = 1;
  const limit = 20;
  if (req.query.page) {
    page = req.query.page;
  }
  try {
    let docs = await Vehicule.find({}, "-__v")
      .sort({ _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate(
        "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
      )
      .lean()
      .exec();
    const count = await Vehicule.countDocuments();
    let resultat = {
      docs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      itemsPerPage: limit,
      count: count,
    };
    res.status(200).json(resultat);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:byQuery", async (req, res, next) => {
  try {
    const filter = req.query;
    let docs = await Vehicule.find(filter, "-__v")
      .sort({ _id: -1 })
      .populate(
        "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
      )
      .lean()
      .exec();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/:all/:onecategory", async (req, res, next) => {
  console.log(req.query);
  try {
    const field = req.query["parent"];
    console.log(field);

    if (req.query["parent"] == "admincentralId") {
      let docs = await Vehicule.find({
        admincentralId: { $exists: true, $ne: null },
      })
        .sort({ _id: -1 })
        .populate(
          "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
        )
        .lean()
        .exec();
      res.status(200).json(docs);
    } else if (req.query["parent"] == "rmiaId") {
      let docs = await Vehicule.find({
        rmiaId: { $exists: true, $ne: null },
      })
        .sort({ _id: -1 })
        .populate(
          "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
        )
        .lean()
        .exec();
      res.status(200).json(docs);
    } else if (req.query["parent"] == "horsrmiaId") {
      let docs = await Vehicule.find({
        horsrmiaId: { $exists: true, $ne: null },
      })
        .sort({ _id: -1 })
        .populate(
          "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
        )
        .lean()
        .exec();
      res.status(200).json(docs);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let Id = req.params.id;
    const filter = { _id: Id };
    let result = await Vehicule.findOneAndRemove(filter);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  let Id = req.params.id;
  const filter = { _id: Id };
  const update = req.body;
  try {
    let result = await Vehicule.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json(error);
  }
});

module.exports = router;
