//曲库
const  express = require("express");
const router = express.Router();
const songLibServices = require("../services/songLibServices");
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
        createFileDirectory("public/img/songLib");
        //指定文件保存路径
        cb(null, 'public/img/songLib');
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
//新增歌曲
router.post("/addSongLib", upload.array("songName"), songLibServices.addSongLib);
//查询歌曲
router.get("/getSongLib", songLibServices.getSongLib);
//删除歌曲
router.get("/delSongLib", songLibServices.delSongLib);
//下载歌曲
router.get("/downloadSongLib", songLibServices.downloadSongLib);
module.exports = router;