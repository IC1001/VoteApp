const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017';
const dbName = 'react';



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
module.exports = {
    connect
}