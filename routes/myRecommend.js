//我的-推荐
const express  = require("express");
const router = express.Router();
const myRecommendServices = require("../services/myRecommendServices");
//新增推荐
router.post("/addMyRecommend", myRecommendServices.addMyRecommend);
//查询推荐
router.get("/getMyRecommend", myRecommendServices.getMyRecommend);
//删除推荐
router.get("/delMyRecommend", myRecommendServices.delMyRecommend);
module.exports = router;