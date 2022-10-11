const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
let io = require("socket.io");

router.post("/", async (req, res, next) => {
  require("../../utils/backup").backupMongoDB();

  res.status(201).json("backup ok");
  return;
  try {
    require("../../utils/backup")();
    res.status(201).json("backup ok");
  } catch (error) {
    res.status(500).json(error);
  }
});
router.post("/restore", async (req, res, next) => {
  require("../../utils/backup").restoreBackup();

  res.status(201).json("backup ok");
  return;
  try {
    require("../../utils/backup")();
    res.status(201).json("backup ok");
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res, next) => {});

router.delete("/:id", async (req, res, next) => {});

router.patch("/:id", async (req, res, next) => {});

module.exports = router;
