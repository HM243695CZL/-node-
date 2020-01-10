//发现下的云村推荐
const express = require("express");
const router = express.Router();
const cloudRecommendServices = require("../services/cloudRecommendServices");
//新增推荐
router.post("/addCloudRecommend", cloudRecommendServices.addCloudRecommend);
//查询推荐
router.get("/getCloudRecommend", cloudRecommendServices.getCloudRecommend);
//删除推荐
router.get("/delCloudRecommend", cloudRecommendServices.delCloudRecommend);
module.exports = router;