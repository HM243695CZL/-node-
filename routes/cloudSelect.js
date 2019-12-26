//发现下的云村精选
const express = require("express");
const router = express.Router();
const cloudSelectServices = require("../services/cloudSelectServices");
const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const fs = require("fs");
const moment = require("moment");
var fileNameList = []; //用来存储上传的文件名
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
        createFileDirectory("public/img/cloudSelect");
        //指定文件保存路径
        cb(null, 'public/img/cloudSelect');
    },
    filename: function(req, file, cb) {
        //设置全局变量，用于保存上传的文件的修改名称
        global.uploadVideoName = moment(new Date()).format("YYYY_MM_DD_HH_mm_ss_") + file.originalname;
        fileNameList.push(global.uploadVideoName);
        cb(null, global.uploadVideoName);
    }
});
const upload = multer({
    storage: storage
});
let multipleFields = upload.fields([
    {
        name: "postSrc"
    },
    {
        name: "videoName"
    }
]);
//新增云村精选
router.post("/addCloudSelect", (req, res) => {
    multipleFields(req, res, (err) => {
        var params = req.body;
        if(params.type === "1"){
            //修改
        }else{
            //新增
            var fileList = [];
            for ( let item in req.files){
                var fieldItem = req.files[item];
                fieldItem.map(ele => {
                    fileList.push({
                        fieldName: ele.fieldname,
                        originalName: ele.originalname
                    })
                })
            }
            db.addData(
                "cloud_music_select",
                "id, title, text, postSrc, videoName, preVideoName, authorId, authorName, createTime",
                "?, ?, ?, ?, ?, ?, ?, ?, ?",
                [uuid.v1(), params.title, params.text, fileNameList[0], fileNameList[1], fileList[1].originalName, params.authorId, params.authorName, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
                err => {
                    //先清空存储上传的文件名的数组
                    fileNameList = [];
                    if(err.effectedRows !== 0){
                        res.json({
                            status: 200,
                            errMsg: "",
                            data: {}
                        })
                    }else{
                        res.json({
                            status: 500,
                            errMsg: "新增失败",
                            data: {}
                        })
                    }
                });
        }
    });
});
//查询云村精选
router.get("/getCloudSelect", cloudSelectServices.getCloudSelect);
//删除云村精选
router.get("/delCloudSelect", cloudSelectServices.delCloudSelect);
module.exports = router;