const db = require("../sql/dbConfig");
exports.getDataTraffic = (req, res, next) => {
    var configPath = [];
    var reqArr = [];
    var totalRow = 0;
    //查询所有路径
    var sql = "select path as name, count(path) as value from cloud_music_visit_info group by path having count(path)>0";
    //查询路径对应的中文名
    var sqlConfigPath = "select path.path, path.cName as name from cloud_music_config_path path";
    //查询总数
    var sqlCount = "select count(*) as count from cloud_music_visit_info";
    db.base(sqlConfigPath, "").then( result => configPath = result.data).then(db.base(sqlCount, "").then(result => {
        totalRow = result.data[0].count;
    }).then( db.base(sql, "").then( result => {
        reqArr = result.data;
        var allArr = configPath.map((item, index) => {
            reqArr.map((list, i) => {
                if(item.path === list.name){
                    item.value = list.value;
                }
            });
            if(!item.value){
                item.value = 0;
            }
            return item;
        });
        var maxPath = configPath.reduce((pre, curr) => {
            return pre.value > curr.value ? pre : curr;
        });
        var minPath = configPath.reduce((pre, curr) => {
            return pre.value < curr.value ? pre : curr;
        });
        var pathArr = []; //存储键的数组
        var valueArr = []; //存储值的数组
        for (var i = 0; i< configPath.length; i++){
            pathArr.push(configPath[i].name);
            valueArr.push(configPath[i].value);
        }
        res.json({
            status: 200,
            errMsg: "",
            data: {
                result: {
                    maxPath,
                    minPath,
                    allArr,
                    pathArr,
                    valueArr,
                    totalRow
                }
            }
        })
    })));
};
exports.TodayData = (req, res, next) => {
    var startTime = req.body.startTime || "";
    var endTime = req.body.endTime || "";
    var configPath = [];
    var reqArr = [];
    var totalRow = 0;
    //按时间查询
    var sqlToday = "SELECT path as name, count(path) as value FROM cloud_music_visit_info where visitTime between '" + startTime + "' and '" + endTime + "' group by path having count(path)>0";
    //按时间查询数量
    var sqlTodayCount = "SELECT count(*) as count FROM `cloud_music_visit_info` where visitTime between '" + startTime + "' and '" + endTime + "'";
    //查询全部路径
    var sqlConfigPath = "select path.path, path.cName as name from cloud_music_config_path path";
    db.base(sqlConfigPath, "").then( result => configPath = result.data).then( db.base(sqlTodayCount, "").then( result => {
        totalRow = result.data[0].count;
    }).then( db.base(sqlToday, "").then( result => {
        reqArr = result.data;
        var allArr = configPath.map((item, index) => {
            reqArr.map((list, i) => {
                if(item.path === list.name){
                    item.value = list.value;
                }
            });
            if(!item.value){
                item.value = 0;
            }
            return item;
        });
        var maxPath = configPath.reduce((pre, curr) => {
            return pre.value > curr.value ? pre : curr;
        });
        var minPath = configPath.reduce((pre, curr) => {
            return pre.value < curr.value ? pre : curr;
        });
        var pathArr = []; //存储键的数组
        var valueArr = []; //存储值的数组
        for (var i = 0; i< configPath.length; i++){
            pathArr.push(configPath[i].name);
            valueArr.push(configPath[i].value);
        }
        res.json({
            status: 200,
            errMsg: "",
            data: {
                result: {
                    maxPath,
                    minPath,
                    allArr,
                    pathArr,
                    valueArr,
                    totalRow
                }
            }
        })
    })))
};
exports.getRecommendListCount = (req, res, next) => {
    var myRecommendCount;
    var mySongSheetCount;
    var listenListenCount;
    var newSongCount;
    db.count("myRecommendTotal", "my_recommend").then( result => {
        myRecommendCount = result.data[0].myRecommendTotal;
    }).then(db.count("mySongSheetTotal", "song_sheet").then( result => {
        mySongSheetCount = result.data[0].mySongSheetTotal;
    }).then( db.count("listenListenTotal", "listen_listen").then( result => {
        listenListenCount = result.data[0].listenListenTotal;
    }).then(db.count("newSongTotal", "new_song").then( result => {
        newSongCount = result.data[0].newSongTotal;
        res.json({
            status: 200,
            errMsg: "",
            data: {
                result: {
                    myRecommendCount,
                    mySongSheetCount,
                    listenListenCount,
                    newSongCount
                }
            }
        })
    }))));

};