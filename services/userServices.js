const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const fs = require("fs");
exports.addUser = (req, res, next) => {
    var params = req.body;
    db.addData(
        "cloud_music_user",
        "id, username, password, imgSrc",
        [uuid.v1(), params.username, params.password, global.uploadFileName]).then( result => {
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
};
exports.getUserList = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_user limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) as count from cloud_music_user";
    var totalRow = 0;
    db.base(sqlCount, "").then( resultCount => totalRow = resultCount.data[0].count).then( db.base(sql, "").then( result => {
        var data = result.data;
        for (var i = 0; i < data.length; i++){
            data[i].imgSrc = db.hostUrl + "user/" + data[i].imgSrc;
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
exports.delUser = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_user where id = ?";
    db.base(sql, [id]).then( resultFileName => {
        var fileName = resultFileName.data[0].imgSrc;
        fs.unlink(`public/img/user/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }else{
                db.delData("cloud_music_user", id).then( result => {
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