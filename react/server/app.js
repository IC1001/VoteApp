const express = require("express")
const app = express()
const model = require('./model/index')
const bodyParser = require('body-parser')
const path = require("path")
const ObjectID = require('mongodb').ObjectID;
// 配置中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//处理静态文件
app.use('/',express.static('../build'))

//请求首页
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
//获取投票内容
app.get('/voteData', (req,res) => {
    model.connect((db) => {
        db.collection("vote").find().toArray( (err, result)=> {
            if(err) { 
                console.log('查询出错')
            }else{
                
                res.send(result)
            }
        })
    })
})
//投票操作
app.post('/submit', (req, res) => {
    let index = req.body.index
    model.connect((db) => {
        let id = {
            _id: ObjectID(req.body.id)
        }
        db.collection("vote").find(id).toArray( function(err, result) {
            if(err) { 
                console.log('查询出错')
            }else{
                let value = result[0].value
                for( let i = 0; i < index.length; i++ ){
                    let value_i = value[index[i] * 1] * 1 + 1
                    value.splice(index[i],1,value_i)
                }
                let sum = 0
                let maxValue = 0                
                for(let x = 0; x < value.length; x++) {
                    sum += value[x]
                    if(maxValue < value[x]) {
                        maxValue = value[x]
                    }
                }
                let updateData = {$set: { maxValue : maxValue , sum: sum, value: value}};
                //更新数据
                model.connect((db) => {
                    db.collection("vote").updateOne(id, updateData,(err2,result2)=> {
                        if(err2) {
                            console.log('数据修改出错')       
                            return 
                        }
                        //发送最新数据
                        model.connect((db) => {
                            db.collection("vote").find(id).toArray( function(err3, result3) {
                                res.send(result3)
                            })
                        })
                    }) 
                })                
            }
        })


    })
})
//创建投票
app.post('/createVote', (req, res) => {
    let rbdata = req.body.votedata
    let item = rbdata.slice(2)
    let arr = []
    let nDate = new Date()
    let date = nDate.getFullYear() + '-' + (nDate.getMonth() + 1)+'-' + nDate.getDate()
    for(let i = 0; i < item.length; i++) {
        arr.push(0)
    }
    let data = {
        title: rbdata[0], 
        maxChoice: rbdata[1],
        item: item,
        value: arr,
        maxValue: 0,
        sum: 0,
        date: date
    }   
    model.connect( (db) => {
        db.collection('vote').insertOne(data, (err,result) => {
            if (err) {
                console.log('创建投票失败');          
            }else {
                res.send()
            }
        })
    })
})

app.listen(3000,function(){
    console.log('服务已启动√ 访问端口：http://localhost:3000/')
})