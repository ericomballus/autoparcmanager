const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../api/models/User");
function CreateAdminUser() {
  User.find({ telephone: 1111 })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        console.log("existe deja");
      } else {
        bcrypt.hash("tititata*", 10, (err, hash) => {
          if (err) {
            console.log(err);
          }
          const user = new User({
            _iduser: new mongoose.Types.ObjectId(),
            telephone: 1111,
            firstName: "admin app",
            password: hash,
          });
          user
            .save()
            .then((result) => {
              console.log(result);
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
}

//});
module.exports = CreateAdminUser;
