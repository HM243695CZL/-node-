//发现下的轮播图
const express = require("express");
const router = express.Router();
const slidePicServices = require("../services/slidePicServices");
const fs = require("fs");
const moment = require("moment");
var createFileDirectory = function(path) {
    try {
        //检测文件夹是否存在，不存在抛出错误
        fs.accessSync(path);
    } catch (error) {
        //创建文件夹
        fs.mkdirSync(path);
    }
};
const multer = require("multer");
//保存上传的图片
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //先创建路径在保存
        createFileDirectory("public/img/slidePic");
        //指定文件保存路径
        cb(null, 'public/img/slidePic');
    },
    filename: function(req, file, cb) {
        //设置全局变量，用于保存上传的文件的修改名称
        global.uploadFileName = moment(new Date()).format("YYYY_MM_DD_HH_mm_ss_") + file.originalname;
        cb(null, global.uploadFileName);
    }
});
const upload = multer({
    storage: storage
});
//新增轮播图
router.post("/addSlidePic", upload.single("slideImg"), slidePicServices.addSlidePic);
//查询轮播图
router.get("/getSlidePic", slidePicServices.getSlidePic);
//删除轮播图
router.get("/delSlidePic", slidePicServices.delSlidePic);
module.exports = router;