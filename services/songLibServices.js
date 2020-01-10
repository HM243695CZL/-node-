const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
var isErr = "";
exports.addSongLib = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        db.updateData(
            "cloud_music_song_lib",
            ["remark"],
            [params.remark, params.id],
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
        //新增
        for (var i = 0; i < req.files.length; i ++){
            db.addData(
                "cloud_music_song_lib",
                "id, songName, preSongName, remark, size, createTime",
                [uuid.v1() + i, req.files[i].filename, req.files[i].originalname, params.remark, req.files[i].size, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
                err => {
                    if(err.effectedRows !== 0){
                        isErr = "no-err";
                    }else{
                        isErr = "has-err";
                    }
                }
            )
        }
        res.json({
            status: 200,
            errMsg: "",
            data: {
                msg: "新增成功，本次新增了" + req.files.length +"条"
            }
        })
        // if(isErr !== "no-err"){
        //     res.json({
        //         status: 200,
        //         errMsg: "",
        //         data: {}
        //     })
        // }else{
        //     res.json({
        //         status: 500,
        //         errMsg: "新增失败",
        //         data: {}
        //     })
        // }
    }
};
exports.getSongLib = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var songName = req.query.songName;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_song_lib where preSongName like '%" + songName + "%' limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) from cloud_music_song_lib where preSongName like '%" + songName + "%'";
    var totalRow = 0;
    db.base(sqlCount, "", resultCount => {
        totalRow = JSON.parse(JSON.stringify(resultCount[0]))["count(*)"];
        db.base(sql, "", result => {
            var data = JSON.parse(JSON.stringify(result));
            for (var i = 0; i < data.length; i++){
                data[i].src = db.hostUrl + "songLib/" + data[i].songName;
                data[i].createTime = moment(data[i].createTime).format("YYYY-MM-DD HH:mm:ss");
                data[i].size = (data[i].size / 1024 / 1024).toFixed(2) + "M";
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
exports.delSongLib = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_song_lib where id = ?";
    db.base(sql, [id], resultFileName => {
        var fileName = JSON.parse(JSON.stringify(resultFileName))[0].songName;
        fs.unlink(`public/img/songLib/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }else{
                db.delData(
                    "cloud_music_song_lib",
                    id,
                    err => {
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
                    }
                )
            }
        })
    })
};
exports.downloadSongLib = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_song_lib where id = ?";
    db.base(sql, [id], resultFileName => {
        var fileName = JSON.parse(JSON.stringify(resultFileName))[0].songName;
        var filePath = path.join(__dirname, "../public/img/songLib/" + fileName);
        var name = JSON.parse(JSON.stringify(resultFileName))[0].preSongName;
        res.download(filePath, name);
    });
};