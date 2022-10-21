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
      ],
    });
    if (found && found.length) {
      res.status(402).json(found[0]);
    } else {
      const doc = new Vehicule(req.body);
      const vehicule = await doc.save();
      let docs = await Vehicule.find({ _id: vehicule._id })
        .populate(
          "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
        )
        .lean()
        .exec();
      req.io.sockets.emit(`vehicule`, docs[0]);
      res.status(201).json(docs[0]);
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
      .sort({ marque: 1 })
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
    console.log(filter);
    let docs = await Vehicule.find(filter)
      .sort({ marque: 1 })
      .populate(
        "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
      )
      .lean()
      .exec();
    if (docs.length > 0) {
      res.status(200).json(docs);
    } else {
      let obj = {};
      for (const key in filter) {
        obj[key] = filter[key].toUpperCase();
      }
      console.log(filter);
      let result = await Vehicule.find(obj)
        .sort({ marque: 1 })
        .populate(
          "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
        )
        .lean()
        .exec();
      res.status(200).json(result);
    }
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
        .sort({ marque: 1 })
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
        .sort({ marque: 1 })
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
        .sort({ marque: 1 })
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

router.get("/:all/:vehicule/:armyId", async (req, res, next) => {
  let arr = [];
  try {
    let brigade = await require("../models/Brigade").find({
      armyId: req.params.armyId,
    });

    if (brigade && brigade.length) {
      for await (const b of brigade) {
        let docs = await Vehicule.find({
          brigadeId: b._id,
        })
          .sort({ marque: 1 })
          .populate(
            "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
          )
          .lean()
          .exec();
        arr = [...arr, ...docs];
      }
      if (arr.length) {
        arr = arr.sort((a, b) => {
          if (a.marque < b.marque) {
            return -1;
          }
          return 0;
        });
      }

      res.status(200).json(arr);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {}
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
  console.log(update);
  try {
    let result = await Vehicule.findOneAndUpdate(
      filter,
      { $set: update },
      { new: true }
    );
    if (result) {
      let doc = await Vehicule.find({ _id: result._id })
        .populate(
          "rmiaId horsrmiaId compagnieId brigadeId bataillonId admincentralId"
        )
        .lean()
        .exec();
      res.status(200).json(doc[0]);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

module.exports = router;
