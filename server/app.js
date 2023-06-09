const express = require("express");
const bodyParser = require("body-parser");
const user = require("./user");
const task = require("./task");
const bookmark = require("./bookmark");

const app = express();
//To support json format in the request and response
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, OPTIONS, PUT"
  );
  next();
});

user(app);
task(app);
bookmark(app);

module.exports = app;
