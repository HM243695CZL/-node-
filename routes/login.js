const express = require("express");
const router = express.Router();
const loginServices = require("../services/loginServices");
//登录
router.post("/login", loginServices.login);
module.exports = router;
