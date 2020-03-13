//npm install mongodb
const MongoClient = require('mongodb').MongoClient //引入模块
const url = 'mongodb://localhost:27017'; //连接端口
const dbName = 'react'; //连接数据库的名称
//回调函数
function connect(callback){
    MongoClient.connect(url, function(err, client) {
    if(err){
        console.log('数据库连接失败' + err);
    }else{
        const db = client.db(dbName);
        callback && callback(db)
        client.close();        
    }
});
}
//Promise
// let connect_p = new Promise(resolve => {
//     const db = client.db(dbName)
//     resolve(db)
// }).then(
//     ()=>{
//         client.close(); 
//     }
// )
module.exports = {
    connect
}