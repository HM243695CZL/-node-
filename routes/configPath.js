const express = require("express");
const router = express.Router();
const configPathServices = require("../services/configPathSerivces");

//新增路径
router.post("/addConfigPath", configPathServices.addConfigPath);
//查询路径
router.get("/getConfigPath", configPathServices.getConfigPath);
//删除路径
router.get("/delConfigPath", configPathServices.delConfigPath);
module.exports = router;