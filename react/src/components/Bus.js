import React, { Component } from 'react'

export default class Bus extends Component {
    constructor(props){
        super(props);
        this.state={
            route: this.props.route
        }

    }
    componentDidMount() {
console.log(this.props.route);

    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
