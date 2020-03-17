//用于封装token生成和解析函数
var jwt = require("jsonwebtoken");
var signKey = "hm243695czl_min_xian";
exports.setToken = function(username, userId){
    return new Promise((resolve, reject) => {
        const token = "Bearer " + jwt.sign({
            name: username,
            _id: userId
        }, signKey, {expiresIn: "1h"});
        resolve(token);
    })
};
exports.verToken = function(token){
    return new Promise((resolve, reject) => {
        const info = jwt.verify(token.split(" ")[1], signKey);
        resolve(info);
    })
};