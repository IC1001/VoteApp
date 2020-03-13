const express = require("express")
const app = express()
const model = require('./model/index')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require("path")
const ObjectID = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')
// 配置中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
//处理静态文件
app.use('/',express.static('../build'))
app.set('secret','dffadsf2223')
app.use(cookieParser('123'))

//请求首页
app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
app.get('/collect',function(req,res) {
    console.log(12);
    
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
app.get('/mine',function(req,res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
app.get('/history',function(req,res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})
//获取投票内容
app.get('/voteData', (req,res) => {
    model.connect((db) => {
        db.collection("vote").find().toArray( (err, result)=> {
            if(err) { 
                console.log('查询出错')
            }else{
                model.connect((db) => {
                    const tokenData = jwt.verify(req.signedCookies.token, app.get('secret'))  
                    let id = {
                        _id: ObjectID(tokenData.id)
                    }
                    db.collection("user").find(id).toArray((err1,result1)=>{
                        let mine = result1[0].my_initiate.join('-')
                        let collected = result1[0].vote_collect.join('-')
                        let voted = result1[0].my_join.join('-')
                        result.forEach((item,i) => {
                            if(voted.indexOf(String(item._id)) != -1){
                                item.voted = true
                            } 
                            if(mine.indexOf(String(item._id)) != -1){
                                item.mine = true
                            }
                            if(collected.indexOf(String(item._id)) != -1){
                                item.collected = true
                            }
                        })
                        // console.log(result);
                        
                        res.send(result.reverse())
                    })
                })
                
            }
        })
    })
})

//退出登录
app.get('/closeLogin',(req, res) => {
    res.cookie('token', ' ', { maxAge:0 });
    res.send()
})
//登录
app.post('/login',(req, res) => {
    if(req.signedCookies.token) {
        // const req_token = req.headers.authorization.split(' ').pop()
        const tokenData = jwt.verify(req.signedCookies.token, app.get('secret'))
        model.connect( (db) => {
            let id = {
                _id: ObjectID(tokenData.id)
            }
            db.collection('user').find(id).toArray((err,result) => {
                if (err) {
                    console.log('查找失败');          
                }else {
                    if(result[0]){
                        res.send({
                            code:1,
                            username: result[0].name 
                        }) 
                    }else{
                        res.cookie('token', ' ', { maxAge:0 });
                        res.send({
                            code:0
                        }) 
                    }
 
                }
            })
        })
        
        
    }else{
        model.connect( (db) => {
            let name = {
                name: req.body.username
            }
            db.collection('user').find(name).toArray((err,result) => {
                if (err) {
                    console.log('查找失败');          
                }else {
                    if(req.body.password == result[0].password){
                        const token = jwt.sign( {id:result[0]._id}, app.get('secret'))//, {expiresIn:"30000ms"}
                        res.cookie("token",token,{ maxAge: 100000*2000,signed:true})
                        res.send({
                            code:1,
                            username: result[0].name
                        })
                    }else {
                        res.send({
                            code: 0
                        })
                    }   
                }
            })
        })
    }
   
})
//注册
app.post('/register',(req, res) => {
    let data = {
        name: req.body.username,
        password: req.body.password,
        vote_collect: [],
        my_initiate: [],
        my_join: []
    }   
    model.connect( (db) => {
        let name = {
            name: req.body.username
        }
        db.collection('user').find(name).toArray((err,result) => {
            if (err) {
                console.log('查找失败');          
            }else {
                if(result[0]==null){
                    model.connect( (db) => {
                        db.collection('user').insertOne(data, (err,result) => {
                            if (err) {
                                console.log('失败');          
                            }else {
                                res.send({
                                    code:1
                                })
                            }
                        })
                    })

                }else {
                    res.send({
                        code: 0
                    })
                }
                
            }
        })
    })   
})
//判断用户名是否存在
app.post('/exist',(req, res) => {
    model.connect( (db) => {
        let name = {
            name: req.body.username
        }
        db.collection('user').find(name).toArray((err,result) => {
            if (err) {
                console.log('查找失败');          
            }else {
                if(result[0]==null){
                    res.send({
                        code: 1
                    })                    
                }else {
                    res.send({
                        code: 0
                    })
                }
                
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
                //记录历史投票记录
                if(req.signedCookies.token) {
                    const tokenData = jwt.verify(req.signedCookies.token, app.get('secret'))
                    let user_id = {
                        _id: ObjectID(tokenData.id)
                    }
                    let my_join = []
                    model.connect((db) => {
                        db.collection("user").find(user_id).toArray((uerr, uresult)=>{
                            if(uerr){
                                console.log('查找历史失败');
                            }
                            my_join = uresult[0].my_join
                            my_join.unshift(req.body.id)
                        })
                        model.connect((db) => {
                            db.collection("user").updateOne(user_id, {$set:{ my_join: my_join}},(uerr2,uresult2)=>{
                                if(uerr2){
                                    console.log('记录历史失败');
                                }
                            })
                        })
                    })
                    
                }

                //投票结果更改
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
                                console.log(result3);
                                
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
            model.connect( (db)=>{
                db.collection('vote').find({title: rbdata[0], date: date}).toArray((err2,result2)=>{
                //记录创建投票记录
                if(req.signedCookies.token) {
                    const tokenData = jwt.verify(req.signedCookies.token, app.get('secret'))
                    let user_id = {
                        _id: ObjectID(tokenData.id)
                    }
                    let my_initiate = []
                    model.connect((db) => {
                        db.collection("user").find(user_id).toArray((uerr, uresult)=>{
                            if(uerr){
                                console.log('查找历史失败');
                            }
                            my_initiate = uresult[0].my_initiate 
                            my_initiate.unshift(ObjectID(result2[0]._id))
                        })
                        model.connect((db) => {
                            db.collection("user").updateOne(user_id, {$set:{ my_initiate: my_initiate}},(uerr2,uresult2)=>{
                                if(uerr2){
                                    console.log('记录创建失败');
                                }
                            })
                        })
                    })                    
                } 

                })
            })
            if (err) {
                console.log('创建投票失败');          
            }else {
                res.send()
            }
        })
    })
})
//收藏投票
app.post('/collect', (req, res) => {
    let vote_id = req.body.id
    const tokenData = jwt.verify(req.signedCookies.token, app.get('secret'))
    model.connect( (db) => {
        let user_id = {
            _id: ObjectID(tokenData.id)
        }
        let vote_collect = []
        db.collection('user').find(user_id).toArray( (err, result) => {
            vote_collect = result[0].vote_collect
            console.log(vote_collect);
            vote_collect.unshift(vote_id)
            console.log(vote_collect);
        })
        //收藏更新
        model.connect( (db) => {
            db.collection('user').updateOne(user_id, {$set:{vote_collect: vote_collect}},(err1, result1) => {
                if(err1) {
                    console.log('数据修改出错:',err1)  
                    return 
                }
                res.send()  
            })
        })

    })
    
})
app.listen(3000,function(){
    console.log('服务已启动√ 访问端口：http://localhost:3000/')
})