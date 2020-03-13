const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
exports.getSongLib = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var songName = req.query.songName || "";
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_song_lib where preSongName like '%" + songName + "%' limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_song_lib where preSongName like '%" + songName + "%'";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then(db.base(sql, "").then( result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].src = db.hostUrl + "songLib/" + data[i].songName;
            data[i].createTime = moment(data[i].createTime).format("YYYY-MM-DD HH:mm:ss");
            data[i].size = (data[i].size / 1024 / 1024).toFixed(2) + "M";
            data[i].songImg = db.hostUrl + "songLib/" + data[i].songImg;
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
exports.delSongLib = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_song_lib where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].songName;
        var imgName = resultFileName.data[0].songImg;
        fs.unlink(`public/img/songLib/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除音频文件",
                    data: {}
                })
            }else{
                fs.unlink(`public/img/songLib/${imgName}`, err => {
                    if(err){
                        res.json({
                            status: 500,
                            errMsg: "删除失败，不能删除音频文件封面",
                            data: {}
                        })
                    }else{
                        db.delData(
                            "cloud_music_song_lib",
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
exports.downloadSongLib = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_song_lib where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].songName;
        var filePath = path.join(__dirname, "../public/img/songLib/" + fileName);
        var name = resultFileName.data[0].preSongName;
        res.download(filePath, name);
    });
};