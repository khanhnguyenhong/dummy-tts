const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const chalk = require("chalk");
const debug = require("debug")("app");
const path = require("path");
const apiRouter = require('./src/api/routes/api.route');

const app = express();
app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "/build")));
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.use(morgan("tiny"));
app.listen(process.env.PORT || 8080, function () {
  debug("Listening on port " + chalk.green(process.env.PORT || 8080));
});