//发现下的轮播图类型
const express = require("express");
const router = express.Router();
const slidePicTypeServices = require("../services/slidePicTypeServices");
//新增类型
router.post("/addSlidePicType", slidePicTypeServices.addSlidePicType);
//查询类型
router.get("/getSlidePicType", slidePicTypeServices.getSlidePicType);
//删除类型
router.get("/delSlidePicType", slidePicTypeServices.delSlidePicType);
module.exports = router;