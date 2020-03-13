const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
exports.addConfigPath = (req, res, next) => {
    var params = req.body;
    db.addData(
        "cloud_music_config_path",
        "id, path, cName, createTime",
        [uuid.v1(), params.path, params.cName, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
    ).then( result => {
        if(result.data.affectedRows !== 0){
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
};
exports.getConfigPath = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_config_path limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_config_path";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then( db.base(sql, "").then( result => {
        var data = result.data;
        res.json({
            status: 200,
            errMsg: "",
            totalRow,
            data: {
                result: data
            }
        })
    }))
};

exports.delConfigPath = (req, res, next) => {
    var id = req.query.id;
    db.delData(
        "cloud_music_config_path",
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
};