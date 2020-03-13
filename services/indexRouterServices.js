const db = require("../sql/dbConfig");
exports.getDataTraffic = (req, res, next) => {
    var visitTime = req.query.visitTime || "";
    var configPath = [];
    var reqArr = [];
    var sql = "select path as name, count(path) as value from cloud_music_visit_info group by path having count(path)>0";
    var sqlConfigPath = "select path.path, path.cName as name from cloud_music_config_path path";
    db.base(sqlConfigPath, "").then( result => configPath = result.data).then( db.base(sql, "").then( result => {
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
                    allArr,
                    pathArr,
                    valueArr
                }
            }
        })
    }))
};