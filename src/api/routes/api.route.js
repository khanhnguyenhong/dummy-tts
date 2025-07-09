const express = require("express");
const fetchTextController = require("../controllers/fetch-text.controller");

const apiRouter = express.Router();
const { fetchText, retriveData, fetchDataFromUrl, fetchHistory } = fetchTextController();

apiRouter.route("/fetch-text/:url").get(fetchText);
apiRouter.route("/fetch-data").post(fetchDataFromUrl);
apiRouter.route("/retrive-data").get(retriveData);
apiRouter.route("/fetch-history").get(fetchHistory);

module.exports = apiRouter;
