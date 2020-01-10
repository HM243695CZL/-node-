const db = require("../sql/dbConfig");
var setToken = require("../tokenConfig/tokenVerify");
exports.login = (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var sql = "select * from cloud_music_user where username = ?";
    var sqlPwd = "select * from cloud_music_user where username = ? and password = ?";
    var params = [username];
    var paramsPwd = [username, password];
    var resUsername = ""; //用户名
    var userId = ""; //用户id
    var userImg = ""; //用户头像
    db.base(sql,params,(result) => {
        if(result.length === 0){
            //用户名不存在
            return res.json({
                status: 500,
                errMsg: "用户名不存在",
                data: {}
            });
        }else{
            var data = JSON.parse(JSON.stringify(result));
            resUsername = data[0].username;
            userId = data[0].id;
            userImg = db.hostUrl + "user/" + data[0].imgSrc;
        }
        db.base(sqlPwd, paramsPwd, (resultPwd) => {
            if(resultPwd.length === 0){
                //密码错误
                return res.json({
                    status: 500,
                    errMsg: "密码错误",
                    data: {}
                })
            }else{
                //成功
                // return res.json({
                //     status: 200,
                //     errMsg: "",
                //     data: {
                //         token: "hm243695czl_huang_min_xian"
                //     }
                // });

                setToken.setToken(username, password).then( data => {
                    return res.json({
                        status: 200,
                        errMsg: "",
                        data: {
                            token: data,
                            username: resUsername,
                            userId,
                            userImg
                        }
                    })
                });
                return next();
            }
        })
    });
};