const filePath = 'F:/WebStudy/voteweb/react/build/index.html'
const express = require("express")
const app = express()
const model = require('./model/index')
const bodyParser = require('body-parser')
const path = require("path")
// 配置中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//处理静态文件
app.use('/',express.static('../build'))

//请求首页
app.get('/',function(req,res) {
    // model.connect((db)=>{
    //     let xx = db.collection('user').find({"name":"xiao"})
    //     console.log(xx);
        
    //     res.send("hello world")
    // })

    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
//获取投票内容
app.get('/voteData', (req,res) => {
    model.connect((db) => {
        db.vote.find({}).toArray( (err, result)=> {
            if(err) { 
                console.log('查询出错')
            }else{
                console.log(result);
                
                res.send(result)
            }
        })
    })
})
//投票操作
app.post('/submit', (req, res) => {
    let index = req.body.index
    model.connect((db) => {
        db.vote.find({id: req.body.id}).toArray( (err, result)=> {
            if(err) { 
                console.log('查询出错')
            }else{
                let value = result.value
                for( let i = 0; i < index; i++ ){
                    let value_i = value[index[i]] + 1
                    value.splice(index[i],1,value_i)
                }
                db.vote.update({id: req.body.id}, {value: value},(err2,result2)=> {
                    if(err) {
                        console.log('数据修改出差')        
                    }else{
                        db.vote.find({id: req.body.id}).toArray( (err3, result3)=> {
                            res.send(result3)
                        })
                        
                    }
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
    for(let i = 0; i < item.length; i++) {
        arr.push(0)
    }
    let data = {
        title: rbdata[0], 
        maxChoice: rbdata[1],
        item: item,
        value: arr,
        maxValue: 0,
        sum: item.length
    }
    console.log(data);
    
    model.connect( (db) => {
        db.collection('vote').insert(data, (err,result) => {
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