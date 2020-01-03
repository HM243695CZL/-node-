/**
 * 封装操作数据库的通用API
 */
const fs = require("fs");
const mysql = require("mysql");
const moment = require("moment");
//查询数据
exports.base = (sql, data, callback) => {
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", "--------------查询--时间："+ moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n", err => {
        if(err){
            console.log("写入查询失败：" + err);
        }
    });
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "cloud_music"
    });
    connection.connect();
    connection.query(sql, data, (err, res) => {
        if(err) throw err;
        callback(res);
        console.log("mysql连接成功...");
    });
    connection.end();
};
/**
 * 新增数据
 * @param tableName 表名
 * @param params 新增的参数
 * @param flagBit 占位符
 * @param receiveParam 接收到的值
 * @param callback
 */
exports.addData = (tableName, params, flagBit, receiveParam, callback) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "cloud_music"
    });
    connection.connect();
    var sql = "insert into " + tableName + "(" + params + ")" + " values(" + flagBit + ")";
    var addStr = "------------------新增--<<"+ tableName + ">>--时间：" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n";
    addStr += receiveParam + "\n";
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", addStr, err => {
        if(err){
            console.log("写入新增失败：" + err);
        }
    });
    connection.query( sql, receiveParam, (err, res) => {
        if(err) throw err;
        callback(res);
        console.log("mysql连接成功...-add");
    });
    connection.end();
};
/**
 * 修改数据
 * @param tableName 表名
 * @param params 修改的参数
 * @param receiveParam 接收的参数值
 * @param callback
 */
exports.updateData = (tableName, params, receiveParam, callback) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "cloud_music"
    });
    connection.connect();
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
    connection.query(sql, receiveParam, (err, res) => {
        if(err) throw err;
        callback(res);
        console.log("mysql连接成功...-update");
    });
    connection.end();
};
/**
 * 删除数据
 * @param tableName 表名
 * @param id 需要删除的id
 * @param callback
 */
exports.delData = (tableName, id, callback) => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "cloud_music"
    });
    connection.connect();
    var sql = "delete from " + tableName + " where id = ?";
    var delStr = "------------------删除--<<"+ tableName + ">>--时间：" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + "----------------\n" + sql + "\n";
    delStr += id + "\n";
    fs.appendFile("./log/access-" + moment(new Date()).format("YYYY-MM-DD") + ".log", delStr, err => {
        if(err){
            console.log("写入删除失败：" + err);
        }
    });
    connection.query(sql, [id], (err, res) => {
        if(err) throw err;
        callback(res);
        console.log("mysql连接成功...-del");
    });
    connection.end();
};
exports.hostUrl = "http://localhost:3002/img/";
