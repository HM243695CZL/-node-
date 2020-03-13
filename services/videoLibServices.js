const db = require("../sql/dbConfig");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
exports.getVideoLib = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var videoName = req.query.videoName || "";
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_video_lib where preVideoName like '%" + videoName + "%' limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_video_lib where preVideoName like '%" + videoName + "%'";
    var totalRow = 0;
    db.base(sqlCount, "", resultCount => totalRow = resultCount.data[0].count).then( db.base(sql, "").then( result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].src = db.hostUrl + "videoLib/" + data[i].videoName;
            data[i].createTime = moment(data[i].createTime).format("YYYY-MM-DD HH:mm:ss");
            data[i].size = (data[i].size / 1024 / 1024).toFixed(2) + "M";
            data[i].videoImg = db.hostUrl + "videoLib/" + data[i].videoImg;
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
exports.delVideoLib = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_video_lib where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].videoName;
        var imgName = resultFileName.data[0].videoImg;
        fs.unlink(`public/img/videoLib/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除视频文件",
                    data: {}
                })
            }else{
                fs.unlink(`public/img/videoLib/${imgName}`, err => {
                    if(err){
                        res.json({
                            status: 500,
                            errMsg: "删除失败，不能删除视频文件封面",
                            data: {}
                        })
                    }else{
                        db.delData(
                            "cloud_music_video_lib",
                            id).then( result => {
                            if(result.data.affectedRows !== 0){
                                res.json({
                                    status: 200,
                                    errMsg: "",
                                    data: {}
                                })
                            }else{
                                res.json({
                                    status: 500,
                                    errMsg: "删除失败，不能从数据库中删除",
                                    data: {}
                                })
                            }
                        })
                    }
                });
            }
        })
    })
};
exports.downloadVideoLib = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_video_lib where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].videoName;
        var filePath = path.join(__dirname, "../public/img/videoLib/" + fileName);
        var name = resultFileName.data[0].preVideoName;
        res.download(filePath, name);
    })
};