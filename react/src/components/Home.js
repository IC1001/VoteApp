import React, { Component } from 'react'

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            test: 55
        }
    }
    getName=()=>{
        this.setState({
            test:'hahaha'
        })
        alert(this.state.test)
    }
    render() {
        return (
            <div>
                {this.state.test}
                <div onClick={this.getName}>????</div>
            </div>
        )
    }
}
