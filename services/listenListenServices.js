const db = require("../sql/dbConfig");
const uuid = require("node-uuid");
const moment = require("moment");
const fs = require("fs");
exports.addListenListen = (req, res, next) => {
  var params = req.body;
  if(params.type === "1"){
      //修改
      var sql = "select * from cloud_music_listen_listen where id = ?";
      db.base(sql, [params.id], resultFileName => {
          var fileName = JSON.parse(JSON.stringify(resultFileName))[0].listenListenImg;
          if(params.listenListenImg === ""){
              db.updateData(
                "cloud_music_listen_listen",
                ["typeValue", "text"],
                [params.typeValue, params.text, params.id],
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
              fs.unlink(`public/img/listenListen/${fileName}`, err => {
                  if(err){
                      console.log(err);
                  }else{
                      db.updateData(
                          "cloud_music_listen_listen",
                          ["typeValue", "listenListenImg", "text"],
                          [params.typeValue, global.uploadFileName, params.text, params.id],
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
                  }
              })
          }
      })
  }else{
      //新增
      db.addData(
          "cloud_music_listen_listen",
          "id, typeValue, listenListenImg, text, createTime",
          [uuid.v1(), params.typeValue, global.uploadFileName, params.text, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")],
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
exports.getListenListen = (req, res, next) => {
    var page = req.query.page || 1;
    var limit = req.query.limit || 10;
    var stateRow = (page - 1) * limit;
    var sql = "select listen.id id, type.typeName, type.typeValue, listen.listenListenImg, listen.text, listen.createTime from cloud_music_listen_listen listen, cloud_music_listen_listen_type type where type.typeValue = listen.typeValue limit " + stateRow + ", " + limit;
    var sqlCount = "select count(*) from cloud_music_listen_listen";
    var totalRow = 0;
    db.base(sqlCount, "", resultCount => {
        totalRow = JSON.parse(JSON.stringify(resultCount[0]))["count(*)"];
        db.base(sql, "", result => {
            var data = JSON.parse(JSON.stringify(result));
            for (var i = 0; i < data.length; i++){
                data[i].listenListenImg = db.hostUrl + "listenListen/" + data[i].listenListenImg;
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
exports.delListenListen = (req, res, next) => {
    var id = req.query.id;
    var sql = "select * from cloud_music_listen_listen where id = ?";
    db.base(sql, [id], resultFileName => {
        var fileName = JSON.parse(JSON.stringify(resultFileName))[0].listenListenImg;
        fs.unlink(`public/img/listenListen/${fileName}`, err => {
            if(err){
                res.json({
                    status: 500,
                    errMsg: "删除失败，不能删除文件",
                    data: {}
                })
            }else{
                db.delData(
                    "cloud_music_listen_listen",
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