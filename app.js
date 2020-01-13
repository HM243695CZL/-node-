const express = require("express");
const app = express();
const morgan = require("morgan"); //日志模块
const fs = require("fs");
const path = require("path");
const FileStreamRotator  = require("file-stream-rotator");
const port = 3002;
const indexRouter = require("./routes/router");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const myRecommendRouter = require("./routes/myRecommend");
const songSheet = require("./routes/songSheet");
const slidePic = require("./routes/slidePic");
const slidePicType = require("./routes/slidePicType");
const recommendSong = require("./routes/recommendSong");
const newSong = require("./routes/newSong");
const cloudSelect = require("./routes/cloudSelect");
const cloudRecommend = require("./routes/cloudRecommend");
const listenListen = require("./routes/listenListen");
const listenListenType = require("./routes/listenListenType");
const songLib = require("./routes/songLib");
var verToken = require("./tokenConfig/tokenVerify");
var expressJwt = require("express-jwt");
var bodyParser = require("body-parser");
/**
 * ******************************
 * 生成日志 start
 */
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
    date_format: "YYYY-MM-DD",
    filename: path.join(logDirectory + '/access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
// 自定义token
morgan.token('from', function(req, res){
    return req.query.from || '-';
});
// 自定义format，其中包含自定义的token
morgan.format('joke', '[joke] :method :url :status :from');
// 使用自定义的format
app.use(morgan('joke'));
app.use(morgan('combined',{stream:accessLogStream}));
/**
 * *******************************************
 * 生成日志 end
 */
/**
 * 设置允许跨域访问该服务器
 */
app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});
// // 验证token是否过期并规定哪些路由不用验证
// app.use(expressJwt({
//     secret: "hm243695czl_min_xian"
// }).unless({
//     path: ["/login"] //除了这个地址，其他URL都需要验证
// }));
// // 解析token获取用户信息
// app.use((req, res, next) => {
//     var token = req.headers["Authorization"];
//     if(token === undefined){
//         return next();
//     }else{
//         verToken.vertoken(token).then( data => {
//             req.data = data;
//             return next();
//         }).catch((err) =>{
//             return next();
//         })
//     }
// });
app.use(bodyParser.urlencoded({extended: false}));
//js向后台post一些文件信息时，会出现request entity too large，express框架的问题，默认的很小，可以通过如下方式设置为10mb
app.use(bodyParser.json({limit: "10mb"}));

//主路由
app.use(indexRouter);
//用户路由
app.use(userRouter);
//登录路由
app.use(loginRouter);
//我的推荐
app.use(myRecommendRouter);
//歌单路由
app.use(songSheet);
//发现下的轮播图路由
app.use(slidePic);
//发现下的轮播图类型
app.use(slidePicType);
//发现下的推荐歌单
app.use(recommendSong);
//发现下的新歌
app.use(newSong);
//发现下的云村精选
app.use(cloudSelect);
//发现下的云村推荐
app.use(cloudRecommend);
//发现下的听听
app.use(listenListen);
//发现下的听听类型
app.use(listenListenType);
//曲库
app.use(songLib);
//暴露public文件夹
app.use(express.static("public"));
// //配置全局错误处理中间件
// app.use((req, res) => {
//     res.json({
//         status: 404
//     })
// });
app.listen(port, () => {
    console.log("running...");
});