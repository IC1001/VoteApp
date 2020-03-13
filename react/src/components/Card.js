import React, { Component } from 'react';
import '../assets/css/vote.css';
import Histogram from './canvas/Histogram'
import Sector from './canvas/Sector'
import { Icon , Alert} from 'antd';
export default class Card extends Component { 
    constructor(props) {
        super(props);
        this.state = { 
          index:[] ,
          isVote: false,
          switch: false,
          isComment:false,
          isStar: false,
          Demo:{item:0},
          demo : this.props.demo,
          tips: false
        }
    }
    componentWillMount() {
        if(this.state.demo.voted){
            this.setState({
                isVote : true
            })
        }
        if(this.state.demo.collected){
            this.setState({
                isStar : true
            })
        }
        if(this.state.demo.mine){
            this.setState({
                isVote : true
            })
        }
    }
    //onchange获取投票项
    getValue = (e) =>{
        let arr = this.state.index
        let str = arr.join('')
        let index = str.indexOf(e.target.dataset.index)
        if(this.state.demo.maxChoice == 1) {
            arr.splice(0,1,e.target.dataset.index)
            this.setState({
                index: arr
            })
        }else{
            if( index != -1 ) {
                arr.splice(index,1)
                this.setState({
                    index: arr
                })
            }else{
                arr.push(e.target.dataset.index)
                this.setState({
                    index: arr
                })
            }
        }   
    }
    //投票
    submit_vote = (e) => {
        if (this.state.index.length < 1) {
            alert('请选择至少一项')
        }else{
            this.$http.post('/submit',{id: this.state.demo._id, index: this.state.index})
            .then((res) => {
                this.setState({
                    demo: res.data[0]
                })
                this.setState({
                    isVote: true
                })  
                
            })
            .catch((err) => {
                console.log('err');
                
            })                
        }
    }
    //收藏
    setStar = () =>{
        if(this.cookie.load('token')){
            if(this.state.isStar == false){
                this.setState({
                    isStar: true
                })
                this.$http.post('collect',{id:this.state.demo._id})
                .then(res => {
                    
                })
            }else{
                this.setState({
                    isStar: false
                })
            }
        }else{
            this.setState({
                tips: true
            })
            setTimeout(()=>{
                this.setState({
                    tips: false
                })                
            },1800)
        }

    }
    //更换显示方式
    switchDisplay = () => {
        this.setState({switch: true})
    }
    returnDisplay = () => {
        this.setState({switch: false})
    }

    render() {
        //循环遍历投票选项
        let option = []
        if(this.state.demo.maxChoice == 1) {
            for( let i = 0; i < this.state.demo.item.length; i++){
                option.push(
                    <div className="input">
                        <input type="radio" name="vote" value={this.state.demo.item[i]}  data-index={i}
                        onChange={this.getValue} />  
                        {this.state.demo.item[i]}
                    </div> 
                )
            }
        }else{
            for( let i = 0; i < this.state.demo.item.length; i++){
                option.push(
                    <div className="input">
                        <input type="checkbox" name="vote" value={this.state.demo.item[i]}  data-index={i}
                        onChange={this.getValue} />  
                        {this.state.demo.item[i]}
                    </div> 
                )
            }            
        }
        //柱状图、圆饼图
        let voteRes = null
        if(this.state.isVote) {
            if(this.state.switch) {
                voteRes= [<Sector data = {this.state.demo} />]
            }else{
                voteRes= [<Histogram data = {this.state.demo} />]
            }
        }

        let watchComment = () => {
            if(this.state.isComment == false){
                this.setState({isComment: true})
            }else{
                this.setState({isComment: false})
            }
            
        }

        return (
            <div>
                <div className="card">
                    <div className="card_title">
                        <div>{this.state.demo.title}</div>
                        <div style={{display:this.isShow(this.state.isVote)}} className="pointer" onClick={this.setStar}>
                            <Icon type="star" style={{display:this.isShow(!this.state.isStar)}}  />
                            <Icon type="star" theme="filled" style={{display:this.isShow(this.state.isStar),color: '#FFD700'}} />
                        </div>
                    </div>
                    <div style={{display:this.isShow(!this.state.isVote)}}>
                        <form>
                            {option}
                        </form>
                    </div>
                    <div style={{display:this.isShow(this.state.isVote)}}>
                        {voteRes}
                    </div>
                    <div className="card_bottom">
                        <div>{this.state.demo.date}</div>
                        {/* <div className="pointer"  
                        style={{display:this.isShow(this.state.isVote)}}>
                            <div style={{display:this.isShow(!this.state.isComment)}} onClick={watchComment}>查看评论<Icon type="down"  /></div>
                            <div style={{display:this.isShow(this.state.isComment)}} onClick={watchComment}>收起评论<Icon type="up" /></div>
                        </div> */}
                        
                        <div className="vote_btn" onClick={this.submit_vote} 
                        style={{display:this.isShow(!this.state.isVote)}}>投票</div>
                        <div style={{display:this.isShow(this.state.isVote)}} className="pointer">
                            <div style={{display:this.isShow(this.state.switch)}} onClick={this.returnDisplay}>柱状图显示</div>
                            <div style={{display:this.isShow(!this.state.switch)}} onClick={this.switchDisplay}>扇形图显示</div>
                        </div>
                    </div>



                </div>
                {/* <div className="comment" style={{display:this.isShow(this.state.isComment)}}>

                </div> */}
            <Alert
            message="请先登录"
            type="warning"
            style={{display:this.isShow(this.state.tips)}}
            />                
            </div>
        )
    }
}
