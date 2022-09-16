const express = require("express");
const mongoose = require("mongoose");
const Vehicule = require("../models/Vehicule");
const router = express.Router();
let io = require("socket.io");

router.post("/", async (req, res, next) => {
  try {
    const doc = new Vehicule(req.body);
    const vehicule = await doc.save();
    req.io.sockets.emit(`vehicule`, vehicule);
    res.status(201).json(vehicule);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    let docs = await Vehicule.find({}, "-__v")
      .sort({ _id: -1 })
      // .populate("parentId")
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
    let docs = await Vehicule.find(filter, "-__v")
      .sort({ _id: -1 })
      // .populate("parentId")
      .lean()
      .exec();
    res.status(200).json(docs);
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
