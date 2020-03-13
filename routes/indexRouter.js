const express = require("express");
const indexRouter = express.Router();
const indexRouterServices = require("../services/indexRouterServices");
indexRouter.get("/getDataTraffic", indexRouterServices.getDataTraffic);

module.exports = indexRouter;