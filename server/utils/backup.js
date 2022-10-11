const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");
const connection = mongoose.connection;
const DB_NAME = "bqg";
const Archive_Path = path.join(process.cwd(), `DB_ARCHIVES.gzip`);
function backupMongoDB() {
  Object.keys(connection.models).forEach(async (collection) => {
    let docs = await connection.models[collection].find({});

    if (docs && docs.length) {
      try {
        fs.writeFileSync(
          path.join(process.cwd(), `${collection}.json`),
          JSON.stringify(docs)
        );
        console.log("done===>", collection);
      } catch (error) {
        console.log("======>", error);
      }
    }
  });
  /* const child = require("child_process").spawn("mongodump", [
    `--forceTableScan`,
    `--db=${DB_NAME}`,
    `--archive=${Archive_Path}`,
    `--gzip`,
  ]);
  child.stdout.on("data", (data) => {});

  child.stderr.on("data", (data) => {
    console.log("copie sur=======>", path.join(process.cwd()));
    console.log("incomming===>", Buffer.from(data).toString());
  });
  child.on("error", (err) => {
    console.log(err);
  });*/
}
function restoreBackup() {
  Object.keys(connection.models).forEach(async (collection) => {
    // console.log(collection);
    if (fs.existsSync(path.join(process.cwd(), `${collection}.json`))) {
      const data = fs.readFileSync(
        path.join(process.cwd(), `${collection}.json`)
      );
      if (data && data.length) {
        if (collection) {
          /* if (collection == "Marquevehicule") {
          } else {
            let all = await require(`../api/models/${collection}`).find({});
            if (all && all.length) {
              all.forEach((doc) => {
                require(`../api/models/${collection}`)
                  .findOneAndRemove({
                    _id: doc._id,
                  })
                  .then((res) => {
                    console.log(res);
                  });
              });
            }
          }*/
        }
        const docs = JSON.parse(data.toString());
        if (docs && docs.length) {
          try {
            docs.forEach(async (doc) => {
              if (collection == "Marquevehicule") {
                const v = require("../api/models/MarqueVehicule");
                let f = await v.find({ _id: doc._id });

                if (f.length == 0) {
                  let r = await v.create(doc);
                }
              } else {
                let resu = await connection.models[collection].find({
                  _id: doc._id,
                });
                if (resu && resu.length) {
                  let r =
                    await require(`../api/models/${collection}`).findOneAndUpdate(
                      { _id: resu[0]._id },
                      { $set: resu[0] },
                      { new: true }
                    );
                } else {
                  let r = await require(`../api/models/${collection}`).create(
                    doc
                  );
                }
              }
            });
          } catch (error) {}
        }
      }
    } else {
      console.log("======> no such file ");
    }
  });
  /*
  const child = require("child_process").spawn("mongorestore", [
  
    `--gzip`,
    `--archive=${Archive_Path}`,
  ]);
  child.stdout.on("data", (data) => {
    console.log("end =======>", data);
  });

  child.stderr.on("data", (data) => {
    console.log("copie sur=======>", path.join(process.cwd()));
    console.log("incomming===>", Buffer.from(data).toString());
  });
  child.on("error", (err) => {
    console.log(err);
  });*/
}
module.exports.backupMongoDB = backupMongoDB;
module.exports.restoreBackup = restoreBackup;
