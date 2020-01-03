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
        if(params.type === "1"){
            //修改
            var sql = "select * from cloud_music_select where id = ?";
            db.base(sql, [params.id], resultFileName => {
                var imgName = JSON.parse(JSON.stringify(resultFileName))[0].postSrc;
                var videoName = JSON.parse(JSON.stringify(resultFileName))[0].videoName;
                if(params.postSrc ==="" && params.videoName === ""){
                    //没有文件上传
                    db.updateData(
                        "cloud_music_select",
                        ["title", "text", "authorId"],
                        [params.title, params.text, params.authorId, params.id],
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
                                    errMsg: "修改失败",
                                    data: {}
                                })
                            }
                        }
                    )
                }else if(params.postSrc !== "" && params.videoName === ""){
                    //有图片，没视频
                    fs.unlink(`public/img/cloudSelect/${imgName}`, err => {
                        if(err){
                            console.log(err);
                        }else{
                            db.updateData(
                                "cloud_music_select",
                                ["title", "text", "authorId", "postSrc"],
                                [params.title, params.text, params.authorId, fileNameList[0], params.id],
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
                                            errMsg: "修改失败",
                                            data: {}
                                        })
                                    }
                                }
                            )
                        }
                    })
                }else if(params.postSrc === "" && params.videoName !== ""){
                    //没图片，有视频
                    fs.unlink(`public/img/cloudSelect/${videoName}`, err => {
                        if(err){
                            console.log(err);
                        }else{
                            db.updateData(
                                "cloud_music_select",
                                ["title", "text", "authorId", "videoName", "preVideoName"],
                                [params.title, params.text, params.authorId, fileNameList[0], fileList[0].originalName, params.id],
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
                                            errMsg: "修改失败",
                                            data: {}
                                        })
                                    }
                                }
                            )
                        }
                    })
                }else{
                    //有图片，有视频
                    fs.unlink(`public/img/cloudSelect/${imgName}`, errImg => {
                        if(errImg){
                            console.log(errImg);
                        }else{
                            fs.unlink(`public/img/cloudSelect/${videoName}`, errVideo => {
                                if(errVideo){
                                    console.log(errVideo);
                                }else{
                                    db.updateData(
                                        "cloud_music_select",
                                        ["title", "text", "authorId", "postSrc", "videoName", "preVideoName"],
                                        [params.title, params.text, params.authorId, fileNameList[0], fileNameList[1], fileList[1].originalName, params.id],
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
                                                    errMsg: "修改失败",
                                                    data: {}
                                                })
                                            }
                                        }
                                    )
                                }
                            })
                        }
                    })
                }
            })
        }else{
            //新增
            db.addData(
                "cloud_music_select",
                "id, title, text, postSrc, videoName, preVideoName, authorId, createTime",
                "?, ?, ?, ?, ?, ?, ?, ?",
                [uuid.v1(), params.title, params.text, fileNameList[0], fileNameList[1], fileList[1].originalName, params.authorId, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
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