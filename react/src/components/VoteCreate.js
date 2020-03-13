import React, { Component } from 'react'
import '../assets/css/VoteCreate.css';
import { Input , Icon, Select} from 'antd';
const { Option } = Select;

export default class VoteCreate extends Component {
    constructor(){
        super();
        this.state = {
            itemNums: 2,
            is9: false,
            inputTitle:'',
            inputArr:['','1','',''],
            isVote:false
        }
    }
    setVote = () => {
        let agency = this.state.isVote
        this.setState({
            isVote: !agency
        })
    }
    //双向绑定input
    handelChange = (e) => {
        let i = e.target.id
        let value = e.target.value
        let change = this.state.inputArr
            change.splice(i,1,value)        
        this.setState({
            inputArr: change
        })
    }
    //创建投票
    createVote = () => {
        this.$http.post('/createVote',{votedata: this.state.inputArr})
        .then((res) => {
            window.location.href='/'
        })
    }

    render() {


        let itemArr = []
        let selectArr = []
        for (let i = 0; i < this.state.itemNums; i++) {
            itemArr.push(
            <div className="itemSet">
                <label for={i+2}>选项{i+1}: </label>
                <Input placeholder={"选项"+(i+1)} id={i+2} onChange={this.handelChange} />
                {/* <Icon type="close" className="delItem" data-i={i} onClick={delItem(e)} /> */}
            </div>)
            if(i > 1){
                selectArr.push(<option value={i} onClick={this.handelChange}>{i}</option>)
            }
            
        }
        // 删除选项
        let delItem = () =>{
            let x = this.state.itemNums - 1
            let change = this.state.inputArr
            change.pop()
            if(x > 1){
                this.setState({
                    itemNums: x,
                    inputArr: change
                })
            }
            if(x == 8) {
                this.setState({
                    is9: false
                })
            }
        }
        //增加选项
        let addItem = () =>{
            let x = this.state.itemNums + 1
            if(x > 8) {
                this.setState({
                    is9: true
                })
            }
            let change = this.state.inputArr
            change.push('')
            this.setState({
                itemNums: x,
                inputArr: change
            })
            
        }

        return (
            <div>
                <div className="createButton" onClick={this.setVote}>
                    <img src={require('../assets/images/vote.png')}></img>
                    <div>发起投票</div>
                </div>
                <div className="createCard" style={{display:this.isShow(this.state.isVote)}}>
                    <div className="createhead">
                        <div>
                            <img src={require('../assets/images/vote.png')}></img>
                            发起投票
                        </div>
                        <Icon type="close"  onClick={this.setVote} /> 
                    </div>
                    {/* <form onSubmit={createVote}> */}
                    <div className="voteContent">
                        <label for="0" style={{fontWeight: 600}}>投票标题: </label>
                            <Input placeholder="投票标题" id="0" onChange={this.handelChange} />
                        {itemArr}
                        <div className="opertion">
                            <div onClick={addItem} className="addButton" style={{display:this.isShow(!this.state.is9)}}>
                                <Icon type="plus" />添加选项
                            </div>
                            <div  className="addButton disable" style={{display:this.isShow(this.state.is9)}}>
                                <Icon type="plus" />添加选项
                            </div>
                            <div onClick={delItem} className="addButton delete" >
                                <Icon type="close" /> 删除一项
                            </div>
                            <div className="setMax"><label for="1">最多选择: </label>
                            <select  defaultValue="1" id="1" onChange={this.handelChange}>
                                <option value={1} >1</option>
                                {selectArr}
                            </select>
                            <label for="1">项</label>
                            </div>
                            <div className="addButton green" onClick={this.createVote}>
                                <Icon type="check-circle" /> 完成创建
                            </div>
                        </div>
                        <div>
                            
                        </div>
                    </div>
                    {/* </form> */}
                </div>
                <div className="model" style={{display:this.isShow(this.state.isVote)}}></div>
            </div>
        )
    }
}
