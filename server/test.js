const Access = require("@regrapes/access-db-parser");
const fs = require("fs");

const dbFile = fs.readFileSync("./DIRMATIA ESSAIE 1.accdb");

const db = new Access.AccessParser(dbFile);
const tables = db.getTables();
console.log(tables);
const child = db.parseTable("Table des erreurs");
console.log(child);
/*
tables.forEach((table, index) => {
  console.log("==========>", table, "================");
  if (
    table == "BASE AERIENNE" ||
    table == "Bénéficiaire" ||
    table == "SERVICE"
  ) {
  } else {
    const child = db.parseTable(table);
    console.log(child);
  }
});*/
//const child = db.parseTable("Bénéficiaire");

const ADODB = require("node-adodb");
const connection = ADODB.open(
  "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=./DIRMATIA ESSAIE 1.accdb;"
);

async function query() {
  try {
    const users = await connection.query("SELECT * FROM Bénéficiaire");

    console.log(JSON.stringify(users, null, 2));
  } catch (error) {
    console.error(error);
  }
}

query();
