//发现下的推荐歌单
const express = require("express");
const router = express.Router();
const recommendSongServices = require("../services/recommendSongServices");
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
        createFileDirectory("public/img/recommendSong");
        //指定文件保存路径
        cb(null, 'public/img/recommendSong');
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
//新增推荐歌单
router.post("/addRecommendSong",upload.single("imgSrc"), recommendSongServices.addRecommendSong);
//查询推荐歌单
router.get("/getRecommendSong", recommendSongServices.getRecommendSong);
//删除推荐歌单
router.get("/delRecommendSong", recommendSongServices.delRecommendSong);
module.exports = router;