import React, { Component } from 'react'
import '../../assets/css/animation.css'
export default class Histogram extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            oneHeight: 46,
            isStart: false
        }

    }


    componentDidMount() {
        function drawChart(item, value, gap, i, maxValue, counts)  {
            let c = document.getElementById("chart" + i);
            let ctx = c.getContext("2d");
            ctx.beginPath();
            let len = value;
            let percent = '  (' + ((value / counts) * 100).toFixed(2) + '%)'
            let r = Math.round(Math.random()*245);
            let g = Math.round(Math.random()*245); 
            let b = Math.round(Math.random()*245); 
            if(maxValue < 35){
                len *= 28
            }else if(maxValue >= 35 && maxValue < 56){
                len *= 21
            }else if(maxValue >= 56 && maxValue < 75 ){
                len *= 14
            }else if(maxValue >= 75 && maxValue < 113 ){
                len *= 7
            }else if(maxValue >= 113 && maxValue < 140 ){
                len *= 6
            }else if(maxValue >= 300){
                len *= 0.8
            }else{
                len *= 2
            }
            ctx.font = "1rem Arial"
            ctx.textBaseline = "top"
            ctx.fillStyle = "rgb("+r+','+g+','+b+')'; 
  
            ctx.fillRect(3,gap,len+2,36);
            if(item.length >20){
                ctx.font = "0.9rem Arial"
                ctx.textBaseline = "bottom"
                ctx.fillText(item.substring(0,10) + percent,len+20,gap+12,1000);
                ctx.fillText(item.substring(10,20)+ percent,len+20,gap+32,1000);
                ctx.fillText(item.substring(20,30)+ percent,len+20,gap+52,1000);
            }else{
                ctx.fillText(item + percent,len+20,gap+12,1000);
            } 
            // ctx.fillText(value,len+20,gap+52,1000)
            ctx.font = "1rem Arial"
            ctx.textBaseline = "top"            
            ctx.fillStyle = "rgb(255,255,255)"; 

            if(maxValue / value > 14){
                ctx.fillStyle = "rgb(0,0,0)"; 
            }
            ctx.fillText(value,4,gap+12,1200);
        }
        let drawHistogram = (data) => {
            let gap = 10;
            for(let i = 0; i < data.item.length; i++){
                let x = data.item[i]   
                let v = data.value[i] * 1
                let y = 1         
                drawChart(x, v, gap, data._id, data.maxValue, data.sum)
                gap += 46
            }
        }
        drawHistogram(this.props.data)
        if(this.state.isStart == false){
            this.setState({
                isStart: true
            })
        }
    }
    componentWillUpdate() {
        if(this.state.isStart == false){
            this.setState({
                isStart: true
            })
        }

    }
    render() {
        
        return (
            <div >
                <div className={this.state.isStart == false ? 'hStart':'hEnd'} 
                style={{height:this.state.oneHeight*this.props.data.item.length + 'px'}}
                ></div>
                <canvas id={"chart" + this.props.data._id}  width='1300px'
                height={this.state.oneHeight*this.props.data.item.length + 'px'}> 
                    您的浏览器不支持canvas
                </canvas>   
            </div>
        )
    }
}

