const express = require("express");
const morgan = require("morgan");
const chalk = require("chalk");
const debug = require("debug")("app");
const path = require("path");

const apiRouter = require('./src/api/routes/api.route');

const app = express();

app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "/src/web")));
app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "/src/web/index.html"));
});

app.use(morgan("tiny"));
app.listen(process.env.PORT || 8080, function () {
  debug("Listening on port " + chalk.green(process.env.PORT || 8080));
});