const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
exports.addSongSheet = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        var sqlS = "select * from cloud_music_song_sheet where id = ?";
        db.base(sqlS, [params.id]).then( resultFileName => {
            var fileName = resultFileName.data[0].songSheetImg;
            if(params.songSheetImg === ""){
                db.updateData(
                    "cloud_music_song_sheet",
                    ["songSheetName"],
                    [params.songSheetName, params.id]).then( result => {
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
                fs.unlink(`public/img/songSheet/${fileName}`, err => {
                    if(err){
                        console.log(err);
                    }else{
                        db.updateData(
                            "cloud_music_song_sheet",
                            ["songSheetName", "songSheetImg"],
                            [params.songSheetName, global.uploadFileName, params.id]).then( result => {
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
                    }
                })
            }
        })
    }else{
        //新增
        db.addData(
            "cloud_music_song_sheet",
            "id, songSheetName, songSheetImg, createTime",
            [uuid.v1(), params.songSheetName, global.uploadFileName, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]).then( result => {
            if(result.data.effectedRows !== 0){
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
        })
    }
};
exports.getSongSheet = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_song_sheet limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_song_sheet";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then(db.base(sql, "").then( result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].songSheetImg = db.hostUrl + "songSheet/" + data[i].songSheetImg;
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
exports.delSongSheet = (req, res, next) => {
    var params = req.query.id;
    var fileNameSql = "select * from cloud_music_song_sheet where id = ?";
    db.base(fileNameSql, [params]).then( resultFileName => {
        var fileName = resultFileName.data[0].songSheetImg;
        fs.unlink(`public/img/songSheet/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }
            else{
                db.delData("cloud_music_song_sheet", params).then( result => {
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
        });
    })
};