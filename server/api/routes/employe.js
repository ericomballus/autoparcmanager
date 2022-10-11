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
  let page = 1;
  const limit = 20;
  if (req.query.page) {
    page = req.query.page;
  }
  try {
    let docs = await Employe.find({}, "-__v")
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("gradeId formationId metierId")
      .lean()
      .exec();
    const count = await Employe.countDocuments();
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
    let docs = await Employe.find(filter, "-__v")
      .sort({ _id: -1 })
      .populate("gradeId formationId metierId")
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

    if (req.query["parent"] == "gradeId") {
      let docs = await Employe.find({
        gradeId: { $exists: true, $ne: null },
      })
        .sort({ _id: -1 })
        .populate("gradeId formationId metierId")
        .lean()
        .exec();
      res.status(200).json(docs);
    } else if (req.query["parent"] == "formationId") {
      let docs = await Employe.find({
        formationId: { $exists: true, $ne: null },
      })
        .sort({ _id: -1 })
        .populate("gradeId formationId metierId")
        .lean()
        .exec();
      res.status(200).json(docs);
    } else if (req.query["parent"] == "metierId") {
      let docs = await Employe.find({
        metierId: { $exists: true, $ne: null },
      })
        .sort({ _id: -1 })
        .populate("gradeId formationId metierId")
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
    let doc = await Employe.findById(Id)
      .populate("gradeId formationId metierId")
      .lean()
      .exec();
    res.status(200).json(doc);
  } catch (e) {
    console.error(e);
    res.status(500).json(error);
  }
});

module.exports = router;
