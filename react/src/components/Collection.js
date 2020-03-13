import React, { Component } from 'react'
import Card from './Card'
import '../assets/css/vote.css';
import '../assets/css/animation.css';
import { BrowserRouter as Router} from 'react-router-dom';

export default class Vote extends Component {
    constructor(props){
        super(props);
        this.state = {
            item:[]
        }
    }  
    componentWillMount() {
        this.$http.get('/voteData')
        .then((res) => {
            this.setState({
                item: res.data
            })
        })
    }

    // setVote = (i, j) =>{
    //     const data = this.state.item.map(v => {
    //         if (v.id === i) {
    //             v.value = '10'
    //         }
    //         return v
    //     });
    //     this.setState((state) => {

    //     })
    // }
    render() {
        let demo = []
        for( let i = 0; i < this.state.item.length; i++){
            if(this.state.item[i].collected){
                demo.push(<Card demo = {this.state.item[i] }  submitVote = {this.setVote} />)
            }    
            
        }
        if(this.state.item.length == 0) {
            let arr =[]
            for( let i = 0; i < 9 ; i++) {
                arr.push(<div></div>)
            }
            demo.push(
                <div className="index_anime">
                    {arr}
                </div>
            )
        }
        
        
        return (
            <div className="vote-page">
                {/* <div style={{"font-size":"1.6rem","text-align":"center"}}>投票</div> */}
                <div>
                    {demo}
                </div>
            </div>
        )
    }
}
