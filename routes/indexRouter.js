const express = require("express");
const indexRouter = express.Router();
const indexRouterServices = require("../services/indexRouterServices");
indexRouter.get("/getDataTraffic", indexRouterServices.getDataTraffic);
indexRouter.post("/TodayData", indexRouterServices.TodayData);
indexRouter.get("/getRecommendListCount", indexRouterServices.getRecommendListCount);
module.exports = indexRouter;