const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
exports.addCloudRecommend = (req, res, next) => {
    var params = req.body;
    db.addData(
        "cloud_music_recommend",
        "id, songId, recommendContent, recommendUser, createTime",
        [uuid.v1(), params.songId, params.recommendContent, params.recommendUser, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
        err => {
            var sql = "update cloud_music_song_lib set commendCount = commendCount + 1 where id = ?";
            if(err.effectedRows !== 0){
                db.base(sql, [params.songId], errUpdate => {
                    if(errUpdate.effectedRows !== 0){
                        res.json({
                            status: 200,
                            errMsg: "",
                            data: {}
                        })
                    }else{
                        res.json({
                            status: 500,
                            errMsg: "更新歌曲评论数失败",
                            data: {}
                        })
                    }
                });
            }else{
                res.json({
                    status: 500,
                    errMsg: "新增失败",
                    data: {}
                })
            }
        }
    );
};
exports.getCloudRecommend = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select recommend.id, song.preSongName, recommend.recommendContent, us.username, recommend.createTime from cloud_music_song_lib song, cloud_music_recommend recommend, cloud_music_user us where song.id = recommend.songId and recommend.recommendUser = us.id limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) from cloud_music_recommend";
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
                totalRow: totalRow,
                data: {
                    result: data
                }
            })
        })
    })
};
/**
 * 1、先根据id查询曲库对应的歌曲id，即songId
 * 2、由songId更新歌曲评论的数量，再删除评论数据
 */
exports.delCloudRecommend = (req, res, next) => {
    var id = req.query.id;
    var sqlSongId = "select * from cloud_music_recommend where id = ?";
    db.base(sqlSongId, [id], resultSongId => {
        var songId = JSON.parse(JSON.stringify(resultSongId))[0].songId;
        var sql = "update cloud_music_song_lib set commendCount = commendCount - 1 where id = ?";
        db.base(sql, [songId], errUpdate => {
            if(errUpdate.affectedRows !== 0){
                db.delData(
                    "cloud_music_recommend",
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
            }else{
                res.json({
                    status: 500,
                    errMsg: "更新歌曲评论数失败",
                    data: {}
                })
            }
        });
    });
};