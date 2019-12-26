//发现下的新歌
const express = require("express");
const router = express.Router();
const newSongServices = require("../services/newSongServices");
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
        createFileDirectory("public/img/newSong");
        //指定文件保存路径
        cb(null, 'public/img/newSong');
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
//新增新歌
router.post("/addNewSong", upload.single("imgSrc"), newSongServices.addNewSong);
//查询新歌
router.get("/getNewSong", newSongServices.getNewSong);
//删除新歌
router.get("/delNewSong", newSongServices.delNewSong);
module.exports = router;