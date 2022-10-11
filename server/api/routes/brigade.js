const express = require("express");
const mongoose = require("mongoose");
const Brigade = require("../models/Brigade");
const router = express.Router();
let io = require("socket.io");

router.post("/", async (req, res, next) => {
  try {
    const doc = new Brigade(req.body);
    const forma = await doc.save();
    req.io.sockets.emit(`Brigade`, forma);
    res.status(201).json(forma);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let docs = await Brigade.find({}, "-__v")
      .sort({ _id: -1 })
      .populate("parentId armyId")
      .lean()
      .exec();
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let docs = await Brigade.find({ _id: req.params.id })
      .populate("parentId armyId")
      .lean()
      .exec();
    res.status(200).json(docs[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    let Id = req.params.id;
    const filter = { _id: Id };
    let result = await Brigade.findByIdAndRemove(Id);
    let Bataillon = require("../models/Bataillon");
    let docs = await Bataillon.find({ parentId: Id });
    if (docs.length) {
      docs.forEach(async (doc) => {
        await Bataillon.findByIdAndRemove(doc._id);
      });
    }
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
    let result = await Brigade.findOneAndUpdate(
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
