/**
 * 封装操作数据库的通用API
 */
const fs = require("fs");
const mysql = require("mysql");
const moment = require("moment");
const databaseInfo = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "cloud_music"
};
const prefixTable = "cloud_music_";
//查询数据
exports.base = (sql, data) => {
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", "--------------查询--时间："+ moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n", err => {
        if(err){
            console.log("写入查询失败：" + err);
        }
    });
    const connection = mysql.createConnection(databaseInfo);
    return new Promise(function(resolve, reject){
        connection.connect();
        connection.query(sql, data, (err, res) => {
            if(err) throw err;
            resolve({
                err,
                data: JSON.parse(JSON.stringify(res))
            });
            console.log("mysql连接成功...");
        });
        connection.end();
    });
};
/**
 * 获取数量
 * @param aliasName 别名
 * @param tableName 表名
 */
exports.count = (aliasName, tableName) => {
    var sql = "select count(*) as " + aliasName + " from " + prefixTable + tableName;
    const connection = mysql.createConnection(databaseInfo);
    return new Promise(function(resolve, reject){
        connection.connect();
        connection.query( sql,"", (err, res) => {
            if(err) throw err;
            resolve({
                err,
                data: JSON.parse(JSON.stringify(res))
            });
            console.log("mysql连接成功...-查询数量");
        });
        connection.end();
    });
};
/**
 * 新增数据
 * @param tableName 表名
 * @param params 新增的参数
 * @param receiveParam 接收到的值
 */
exports.addData = (tableName, params, receiveParam) => {
    var flagBitStr = "";
    for (var i = 0; i < params.split(", ").length; i++){
        if(i === params.split(", ").length - 1){
            flagBitStr += "?";
        }else{
            flagBitStr += "?, ";
        }
    }
    var sql = "insert into " + tableName + "(" + params + ")" + " values(" + flagBitStr + ")";
    var addStr = "------------------新增--<<"+ tableName + ">>--时间：" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n";
    addStr += receiveParam + "\n";
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", addStr, err => {
        if(err){
            console.log("写入新增失败：" + err);
        }
    });
    const connection = mysql.createConnection(databaseInfo);
    return new Promise(function(resolve, reject){
        connection.connect();
        connection.query( sql, receiveParam, (err, res) => {
            if(err) throw err;
            resolve({
                err,
                data: JSON.parse(JSON.stringify(res))
            });
            console.log("mysql连接成功...-add");
        });
        connection.end();
    });
};
/**
 * 修改数据
 * @param tableName 表名
 * @param params 修改的参数
 * @param receiveParam 接收的参数值
 */
exports.updateData = (tableName, params, receiveParam) => {
    var paramStr = "";
    for (var i = 0; i < params.length; i++){
        if(i === params.length - 1){
            paramStr += params[i] + " = ? "
        }else{
            paramStr += params[i] + " = ?, ";
        }
    }
    var sql = "update " + tableName + " set " + paramStr + "where id = ?";
    var editStr = "------------------修改--<<"+ tableName + ">>--时间：" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n";
    editStr += receiveParam + "\n";
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", editStr, err => {
        if(err){
            console.log("写入修改失败：" + err);
        }
    });
    const connection = mysql.createConnection(databaseInfo);
    connection.connect();
    return new Promise(function(resolve, reject){
        connection.query(sql, receiveParam, (err, res) => {
            if(err) throw err;
            resolve({
                err,
                data: JSON.parse(JSON.stringify(res))
            });
            console.log("mysql连接成功...-update");
        });
        connection.end();
    });
};
/**
 * 删除数据
 * @param tableName 表名
 * @param id 需要删除的id
 */
exports.delData = (tableName, id) => {
    var sql = "delete from " + tableName + " where id = ?";
    var delStr = "------------------删除--<<"+ tableName + ">>--时间：" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n";
    delStr += id + "\n";
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", delStr, err => {
        if(err){
            console.log("写入删除失败：" + err);
        }
    });
    const connection = mysql.createConnection(databaseInfo);
    return new Promise(function(resolve,reject){
        connection.connect();
        connection.query(sql, [id], (err, res) => {
            if(err) throw err;
            resolve({
                err,
                data: JSON.parse(JSON.stringify(res))
            });
            console.log("mysql连接成功...-del");
        });
        connection.end();
    });
};
exports.hostUrl = "http://localhost:3002/img/";
