const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
exports.addListenListenType = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        db.updateData(
            "cloud_music_listen_listen_type",
            ["typeName", "typeValue"],
            [params.typeName, params.typeValue, params.id],
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
        db.addData(
            "cloud_music_listen_listen_type",
            "id, typeName, typeValue, createTime",
            [uuid.v1(), params.typeName, params.typeValue, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
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
            }
        )
    }
};
exports.getListenListenType = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_listen_listen_type limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) from cloud_music_listen_listen_type";
    var totalRow = 0;
    db.base(sqlCount, "", resultCount => {
        totalRow = JSON.parse(JSON.stringify(resultCount[0]))["count(*)"];
        db.base(sql, "", result => {
            var data = JSON.parse(JSON.stringify(result));
            for (var i = 0; i < data.length; i++){
                data[i].createTime = moment(data[i].createTime).format("YYYY-MM-DD HH:mm:ss");
            }
            res.json({
                status: 200,
                errMsg: "",
                totalRow,
                data: {
                    result: data
                }
            })
        })
    })
};
exports.delListenListenType = (req, res, next) => {
    var id = req.query.id;
    db.delData(
        "cloud_music_listen_listen_type",
        id,
        err => {
            if(err.effactedRows !== 0){
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
};