//曲库
const  express = require("express");
const router = express.Router();
const songLibServices = require("../services/songLibServices");
const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const fs = require("fs");
const moment = require("moment");
var fileNameList = []; //用来存储上传的文件名
var isErr = "";
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
        fileNameList.push(global.uploadFileName);
        cb(null, global.uploadFileName);
    }
});
const upload = multer({
    storage: storage
});
let multipleFields = upload.fields([
    {
        name: "songName"
    },
    {
        name: "songImg"
    }
]);
//新增歌曲
router.post("/addSongLib", (req, res) => {
    multipleFields(req, res, err => {
        var params = req.body;
        var fileList = [];
        for (let item in req.files){
            var fieldItem = req.files[item];
            fieldItem.map(ele => {
                fileList.push({
                    fieldName: ele.fieldname,
                    originalName: ele.originalname
                })
            })
        }
        if(params.type === "1"){
            //修改
            db.updateData(
                "cloud_music_song_lib",
                ["remark"],
                [params.remark, params.id]).then( result => {
                if(result.data.effectedRows !== 0){
                    res.json({
                        status: 200,
                        errMsg: "",
                        data: {}
                    })
                }else{
                    res.json({
                        status: 500,
                        errMsg: "修改失败",
                        data: {}
                    })
                }
            })
        }else{
            //新增
            for (var i = 0; i < fileList.length - 1; i ++){
                db.addData(
                    "cloud_music_song_lib",
                    "id, songName, preSongName, songImg, remark, size, createTime",
                    [uuid.v1() + i, fileNameList[i], fileList[i].originalName, fileNameList[fileNameList.length - 1], params.remark, req.files["songName"][i].size, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
                ).then( result => {
                    if(result.data.effectedRows !== 0){
                        isErr = "no-err";
                    }else{
                        isErr = "has-err";
                    }
                })
            }
            res.json({
                status: 200,
                errMsg: "",
                data: {
                    msg: "新增成功，本次新增了" + (fileNameList.length - 1) + "条"
                }
            })
        }
    })
});
//查询歌曲
router.get("/getSongLib", songLibServices.getSongLib);
//删除歌曲
router.get("/delSongLib", songLibServices.delSongLib);
//下载歌曲
router.get("/downloadSongLib", songLibServices.downloadSongLib);
module.exports = router;