const express = require("express");
const mongoose = require("mongoose");
const Employe = require("../models/Employe");
const router = express.Router();
let io = require("socket.io");

router.post("/", async (req, res, next) => {
  try {
    let found = await Employe.find({ telephone: req.body.telephone });
    if (found && found.length) {
      res.status(402).json(found[0]);
    } else {
      const doc = new Employe(req.body);
      const employe = await doc.save();
      req.io.sockets.emit(`Employe`, employe);
      res.status(201).json(employe);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let docs = await Employe.find({}, "-__v")
      .sort({ _id: -1 })
      .populate("gradeId formationId metierId")
      .lean()
      .exec();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:byQuery", async (req, res, next) => {
  try {
    const filter = req.query;
    let docs = await Employe.find(filter, "-__v")
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
      let docs = await Employe.find({
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
      let docs = await Employe.find({
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
      let docs = await Employe.find({
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
    let result = await Employe.findOneAndRemove(filter);
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
    let result = await Employe.findOneAndUpdate(
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
