const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(express.json());

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const tourRouter = require("./routes/tourRoutes");
const calendary = require("./routes/calendary");

app.use("/api/v1", tourRouter);
app.use("/api/calendary", calendary);

module.exports = app;
