const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
exports.getCloudSelect = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select sel.id id, sel.title, sel.text, sel.preVideoName, sel.videoName, sel.postSrc,sel.authorId, sel.commendCount, sel.agreeCount, us.imgSrc as userHeadPic, us.username as selUsername from cloud_music_select sel, cloud_music_user us where sel.authorId = us.id limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_select";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then( db.base(sql, "").then( result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].postSrc = db.hostUrl + "cloudSelect/" + data[i].postSrc;
            data[i].videoName = db.hostUrl + "cloudSelect/" + data[i].videoName;
            data[i].userHeadPic = db.hostUrl + "user/" + data[i].userHeadPic;
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
    }))
};
exports.delCloudSelect = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_select where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var videoName = resultFileName.data[0].videoName;
        var postSrc = resultFileName.data[0].postSrc;
        fs.unlink(`public/img/cloudSelect/${videoName}`, errV => {
            if(errV){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除该视频",
                    data: {}
                })
            }else{
                fs.unlink(`public/img/cloudSelect/${postSrc}`, err => {
                    if(err){
                        res.json({
                            status: 500,
                            errMsg: "删除失败，不能删除图片",
                            data: {}
                        })
                    }else{
                        db.delData("cloud_music_select", id).then( result => {
                            if(result.data.affectedRows !== 0){
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
                })
            }
        })
    })
};