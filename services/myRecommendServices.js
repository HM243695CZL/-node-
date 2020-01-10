const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
exports.addMyRecommend = (req, res, next) => {
    var params = req.body;
    if(params.type === "1"){
        //修改
        db.updateData(
            "cloud_music_my_recommend",
            ["descName", "iconName"],
            [params.descName, params.iconName, params.id],
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
        });
    }else{
        //新增
        db.addData(
            "cloud_music_my_recommend",
            "id, descName, iconName",
            [uuid.v1(), params.descName, params.iconName],
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
                    errMsg: "新增失败",
                    data: {}
                })
            }
        });
    }
};
exports.getMyRecommend = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select * from cloud_music_my_recommend limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) from cloud_music_my_recommend";
    var totalRow = 0;
    db.base(sqlCount, "", resultCount => {
        totalRow = JSON.parse(JSON.stringify(resultCount[0]))["count(*)"];
        db.base(sql, "", result => {
            res.json({
                status: 200,
                errMsg: "",
                totalRow: totalRow,
                data: {
                    result: result
                }
            })
        })
    });
};
exports.delMyRecommend = (req, res, next) => {
    var id = req.query.id;
    db.delData("cloud_music_my_recommend", id, err => {
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
    });
};