const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/signup", async (req, res, next) => {
  User.find({ telephone: req.body.telephone })
    .exec()
    .then((user) => {
      console.log(user.length);
      if (user.length >= 1) {
        console.log("existe deja");
        res.status(500).json({
          message: "Numero de telephone deja utilisé par un autre client",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err,
            });
          }
          const user = new User({
            _iduser: new mongoose.Types.ObjectId(),
            email: req.body.email,
            role: req.body.role,
            telephone: req.body.telephone,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            company: req.body.company,
            city: req.body.city,
            password: hash,
            role: req.body.role,
            venderRole: req.body.userRole,
          });
          user
            .save()
            .then((result) => {
              console.log(result);
              req.io.sockets.emit(`newUser`, result);
              res.status(201).json({
                message: result,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        });
      }
    });
});

router.post("/login", async (req, res, next) => {
  let userdata;
  User.find({ telephone: req.body.telephone })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message2: `Auth failed, ${req.body.email},is not correct`,
        });
      }
      userdata = user;

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            // message: "Auth failed",
            message2: `Auth failed password,is not correct`,
          });
        }
        if (result) {
          return res.status(200).json({
            user,
          });
        }
        console.log(err);

        res.status(401).json({
          message2: `Auth failed password,is not correct`,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        message3: `Auth failed password msg 3`,
      });
    });
});

router.get("/", (req, res, next) => {});

router.get("/:id", async (req, res, next) => {});

router.delete("/:id", (req, res, next) => {});

router.patch("/", (req, res, next) => {
  const id = req.body._id;
  console.log(req.body);
  if (req.body.userRole) {
    req.body.venderRole = true;
  }

  if (req.body.newpassword) {
    bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      } else {
        console.log(hash);
        req.body["password"] = hash;
        delete req.body.newpassword;
        console.log(req.body);
        User.update({ _id: id }, { $set: req.body })
          .exec()
          .then((result) => {
            res.status(200).json({
              message: "produit mise a jour",
              resultat: req.body,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              error: err,
            });
          });
      }
    });
  } else {
    User.update(
      { _id: id },
      //  { $set: { autorization: req.body.autorization, storeId: req.body.storeId } }
      { $set: req.body }
    )
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "produit mise a jour",
          resultat: req.body,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      });
  }
});
//});
module.exports = router;
