import React, { Component } from 'react'
import '../assets/css/App.css';
export default class nav extends Component {
    constructor(){
        super();
        this.state = {
            nav:[
                '首页','我的'
            ],
            isLogin: false
        }
    }

    render() {
        let titles = []
        for(let i = 0; i < this.state.nav.length; i++){
            titles.push(<div>{this.state.nav[i]}</div>)
        }    
        function findStr(str) {
            let result = '' 
            let temp = ''
            for(let i = 0; i < str.length; i++){
                if(result.indexOf(str.charAt(i)) === -1){
                    result += str.charAt(i)
                }else{
                    if(temp.length < result.length || temp === ''){
                        temp = result
                    }
                    result = str.charAt(i)
                }
            }
            console.log('长度为：'+temp.length+'  字串为:'+temp);
            
        }    
        findStr('rrwerqwedse')
        let isLogin = []
        return (
                <div className="nav">
                    <div className="navBar">
                        <div>
                            <img src={require('../assets/images/logo.png')}></img>投票网站
                        </div>
                        {/* <div className="bs">
                            我的<img src={require('../assets/images/3.png')} ></img>
                            <div className="mineBar">
                                <div style={{display:this.isShow(!this.state.isLogin)}}>
                                    <div>登录</div>
                                    <div>注册</div>
                                </div>
                                <div style={{display:this.isShow(this.state.isLogin)}}>
                                    <div>我发起的</div>
                                    <div>我的收藏</div>
                                    <div>历史投票</div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>


        )
    }
}
