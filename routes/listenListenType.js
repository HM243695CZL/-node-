//发现下的听听类型
const express = require("express");
const router = express.Router();
const listenListenTypeServices = require("../services/listenListenTypeServices");
//新增类型
router.post("/addListenListenType", listenListenTypeServices.addListenListenType);
//查询类型
router.get("/getListenListenType", listenListenTypeServices.getListenListenType);
//删除类型
router.get("/delListenListenType", listenListenTypeServices.delListenListenType);
module.exports = router;