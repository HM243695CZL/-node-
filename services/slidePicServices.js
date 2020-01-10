const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
exports.addSlidePic = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        var sql = "select * from cloud_music_slide_pic where id = ?";
        db.base(sql, [params.id], resultFileName => {
            var fileName = JSON.parse(JSON.stringify(resultFileName))[0].slideImg;
            if(params.slideImg === ""){
                db.updateData(
                    "cloud_music_slide_pic",
                    ["imgType"],
                    [params.imgType, params.id],
                    err => {
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
            }else{
                fs.unlink(`public/img/slidePic/${fileName}`, err => {
                    if(err){
                        console.log(err);
                    }else{
                        db.updateData(
                            "cloud_music_slide_pic",
                            ["imgType", "slideImg"],
                            [params.imgType, global.uploadFileName, params.id],
                                err => {
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
                        })
                    }
                })
            }
        });
    }else{
        //新增
        db.addData(
            "cloud_music_slide_pic",
            "id, imgType, slideImg, createTime",
            [uuid.v1(), params.imgType, global.uploadFileName, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
                err => {
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
};
exports.getSlidePic = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select pic.id id, type.typeValue, type.typeName, pic.slideImg from cloud_music_slide_pic_type type, cloud_music_slide_pic pic where type.typeValue = pic.imgType limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) from cloud_music_slide_pic";
    var totalRow = 0;
    db.base(sqlCount, "", resultCount => {
        totalRow = JSON.parse(JSON.stringify(resultCount[0]))["count(*)"];
        db.base(sql, "", result => {
            var data = JSON.parse(JSON.stringify(result));
            for (var i = 0; i < data.length; i++){
                data[i].slideImg = db.hostUrl + "slidePic/" + data[i].slideImg;
                data[i].createTime = moment(data[i].createTime).format("YYYY-MM-DD HH:mm:ss");
            }
            res.json({
                status: 200,
                errMsg: "",
                totalRow: totalRow,
                data: {
                    result: data
                }
            })
        })
    })
};
exports.delSlidePic = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_slide_pic where id = ?";
    db.base(sql, [id], resultFileName => {
        var fileName = JSON.parse(JSON.stringify(resultFileName))[0].slideImg;
        fs.unlink(`public/img/slidePic/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }else{
                db.delData("cloud_music_slide_pic", id, err => {
                    if(err.affectedRows !== 0){
                        res.json({
                            status: 200,
                            errMsg: "",
                            data: {}
                        })
                    }else{
                        res.json({
                            status: 500,
                            errMsg: "删除失败",
                            data: {}
                        })
                    }
                })
            }
        });
    });
};