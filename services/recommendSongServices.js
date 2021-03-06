const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
exports.addRecommendSong = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        var sql = "select * from cloud_music_recommend_song where id = ?";
        db.base(sql, [params.id]).then( resultFileName => {
            var fileName = resultFileName.data[0].imgSrc;
            if(params.imgSrc === ""){
                //没有文件上传，不修改文件
                db.updateData(
                    "cloud_music_recommend_song",
                    ["text"],
                    [params.text, params.id]).then( result => {
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
                fs.unlink(`public/img/recommendSong/${fileName}`, err => {
                    if(err){
                        console.log(err);
                    }else{
                        db.updateData(
                            "cloud_music_recommend_song",
                            ["text", "imgSrc"],
                            [params.text, global.uploadFileName, params.id]).then( result => {
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
            "cloud_music_recommend_song",
            "id, text, imgSrc, createTime",
            [uuid.v1(), params.text, global.uploadFileName, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]).then( result => {
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
exports.getRecommendSong = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_recommend_song limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_recommend_song";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then(db.base(sql, "").then(result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].imgSrc = db.hostUrl + "recommendSong/" + data[i].imgSrc;
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
exports.delRecommendSong = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_recommend_song where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].imgSrc;
        fs.unlink(`public/img/recommendSong/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }else{
                db.delData("cloud_music_recommend_song", id).then( result => {
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
    })
};