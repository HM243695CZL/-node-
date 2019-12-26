const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");
const fs = require("fs");
const moment = require("moment");
var createFileDirectory = function(path){
    try{
        //检测文件夹是否存在，不存在跑出异常
        fs.accessSync(path);
    } catch (err) {
        //创建文件夹
        fs.mkdirSync(path);
    }
};
const multer = require("multer");
//保存上传的图片
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        //先创建路径再保存
        createFileDirectory("public/img/user");
        //指定文件保存路径
        cb(null, "public/img/user");
    },
    filename: function(req, file, cb){
        //设置全局变量，用于保存上传的文件的修改名称
        global.uploadFileName = moment(new Date()).format("YYYY_MM_DD_HH_mm_ss_") + file.originalname;
        cb(null, global.uploadFileName);
    }
});
const upload = multer({
    storage: storage
});
//新增用户
router.post("/addUser",upload.single("imgSrc"), userServices.addUser);
//查询用户列表
router.get("/getUserList", userServices.getUserList);
//删除用户
router.get("/delUser", userServices.delUser);
module.exports = router;