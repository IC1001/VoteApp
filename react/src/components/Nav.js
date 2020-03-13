import React, { Component } from 'react'
import '../assets/css/App.css';
import Login from './user/login'
import Register from './user/register'
import { Link } from 'react-router-dom'

export default class nav extends Component {
    constructor(){
        super();
        this.state = {
            nav:[
                '首页','我的'
            ],
            isLogin: false,
            login: false,
            register: false,
            name: '我的'
        }
    }
    componentWillMount () {

        if(this.cookie.load('token')){
            this.$http.post('login',{token: this.cookie.load('token')})
            .then(res=>{
                if(res.data.code == 1) {
                    this.setState({
                        isLogin: true,
                        name: res.data.username
                    })
                    this.isLogin(this, res.data.username)
                }else{
                    alert('cookie已过期')
                }
            })
        }
    }
    closeLogin = () => {
        this.$http.get('/closeLogin')
        .then(res => {
            window.location.reload()
            // this.setState({
            //     isLogin: false,
            //     name: '我的'
            // })
        })
    }

    login = () => {
        let temp = !this.state.login
        if(this.state.register == true) {
            this.setState({
                register: false
            })
        }
        this.setState({
            login: temp
        })
    }
    register = () => {
        let temp = !this.state.register
        if(this.state.login == true) {
            this.setState({
                login: false
            })
        }
        this.setState({
            register: temp
        })
    }
    
    isLogin = (e, name) => {
        this.setState({
            isLogin: true,
            name: name
        })
    }
//路由
    toMine = () => {
        window.location.reload()
    }
    toCollect = () => {
        window.location.reload()
    }
    toJoin = () => {
        window.location.reload()
    }

    render() {
        return (
            <div>
                <div className="nav">
                    <div className="navBar">
                        <div>
                            <img src={require('../assets/images/logo.png')}></img>投票网站
                        </div>
                        <div className="bs">
                            {this.state.name}<img src={require('../assets/images/3.png')} ></img>
                            <div className="mineBar">
                                <div style={{display:this.isShow(!this.state.isLogin)}}>
                                    <div onClick={this.login}>登录</div>
                                    <div onClick={this.register}>注册</div>
                                </div>
                                <div style={{display:this.isShow(this.state.isLogin)}} >
                                    <div onClick={this.toMine}><Link to="/mine">我发起的</Link></div>
                                    <div onClick={this.toCollect}><Link to="/collect">我的收藏</Link></div>
                                    <div onClick={this.toJoin}><Link to="/history">历史投票</Link></div>
                                    <div onClick={this.closeLogin}>退出登录</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                {this.state.login ? <Login quitLogin={this.login} toRegister={this.register} isLogin={this.isLogin}></Login> : null}
                {this.state.register ? <Register quitLogin={this.register} toLogin={this.login} ></Register> : null}
            </div>
        )
    }
}
