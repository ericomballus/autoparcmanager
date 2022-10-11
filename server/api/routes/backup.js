const path = require("path");
const DB_NAME = "maeri";
const Archive_Path = path.join(__dirname, `mballus`);

function backupMongoDB() {
  const child = require("child_process").spawn("mongodump", [
    `--db=${DB_NAME}`,
    `--archive=mballus/`,
    `--gzip`,
  ]);
  child.stdout.on("data", (data) => {
    console.log(data);
  });

  child.stderr.on("data", (data) => {
    console.log("error", Buffer.from(data).toString());
  });
  child.on("error", (err) => {
    console.log(err);
  });
}
backupMongoDB();
