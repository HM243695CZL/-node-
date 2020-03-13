const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
var tableName = "cloud_music_square";
exports.addSquare = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        var sql = "select * from cloud_music_square where id = ?";
        db.base(sql, [params.id]).then( resultFileName => {
            var fileName = resultFileName.data[0].squareImg;
            if(params.squareImg === ""){
                db.updateData(
                    tableName,
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
                fs.unlink(`public/img/square/${fileName}`, err => {
                    if(err){
                        console.log(err);
                    }else{
                        db.updateData(
                            tableName,
                            ["squareImg", "text"],
                            [global.uploadFileName, params.text, params.id]).then( result => {
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
            tableName,
            "id, squareImg, text, authorId, createTime",
            [uuid.v1(), global.uploadFileName, params.text, params.authorId, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]).then( result => {
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
exports.getSquare = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select square.id id, square.squareImg, us.id as authorId, us.imgSrc as imgSrc, us.username as username, square.text, square.agreeCount, square.createTime from cloud_music_square square, cloud_music_user us where square.authorId = us.id limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_square";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then(db.base(sql, "").then( result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].squareImg = db.hostUrl + "square/" + data[i].squareImg;
            data[i].imgSrc = db.hostUrl + "user/" + data[i].imgSrc;
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
exports.delSquare = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_square where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].squareImg;
        fs.unlink(`public/img/square/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }else{
                db.delData(
                    tableName,
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
                            errMsg: "删除失败",
                            data: {}
                        })
                    }
                })
            }
        })
    })
};