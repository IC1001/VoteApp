import React, { Component } from 'react'
import '../../assets/css/animation.css'
export default class sector extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            oneHeight: 500,
            isStart2: false
        }

    }

    componentDidMount() {
        function drawChart(item, value , i, start, end, percent, gap)  {
            let c = document.getElementById("chart" + i);
            let ctx = c.getContext("2d");
            ctx.beginPath();
            let r = Math.round(Math.random()*245);
            let g = Math.round(Math.random()*245); 
            let b = Math.round(Math.random()*245); 
            let x = 650
            let y = 260
            ctx.moveTo(x, y);
            ctx.arc( x, y , y - 50, start, end)

            ctx.font = "1rem Arial"
            ctx.fillStyle = "rgb("+r+','+g+','+b+')';    
            ctx.fill()
            ctx.font = "bold 1rem Arial "
            ctx.textBaseline = "top"
            let text = ' ' + value + ' (' + ((100 * percent).toFixed(2)) + '%)'
            ctx.textAlign = 'left'
            ctx.fillRect(5, 47 * (gap+2.5), 14, 14)
            ctx.fillText(item + text, 24, 47 * (gap+2.5), 1000)

            ctx.moveTo(x, y);
            if(value != 0) {
                let Angle = (end  - start) / 2
                let edge =  (y - 50) + 45
                // 设置标题x
                let edgeX = Math.cos( start +  Angle) * edge
                let tX = x + edgeX

                // 设置标题y
                let edgeY = Math.sin( start +  Angle) * edge
                let tY = y + edgeY
                
                //画线
                ctx.strokeStyle = "rgb("+r+','+g+','+b+')';  
                ctx.lineTo(tX, tY)
                //伸出的横线
                let textWidth = ctx.measureText(item + text).width
                ctx.textBaseline = "bottom"  
                
                if(tX > x){
                    ctx.lineTo(tX + textWidth, tY)
                    ctx.textAlign = 'left'
                }else{
                    ctx.lineTo(tX - textWidth, tY) 
                    ctx.textAlign = 'right'
                
                }
                ctx.fillText(item + text, tX, tY, 1000 )
                ctx.stroke()                
            }

        }
        let drawSector = (data) => {
            let start = 0
            let end = 0
            const angle = Math.PI * 2
            for(let i = 0; i < data.item.length; i++){
                let x = data.item[i]
                let v = data.value[i]
                let percent = v / data.sum
                end += angle * percent   
                drawChart(x, v, data._id, start, end, percent, i)
                start = end
            }
        }
        drawSector(this.props.data)
        if(this.state.isStart2 == false){
            this.setState({
                isStart2: true
            })
        }
    }
    componentWillUpdate() {
        if(this.state.isStart2 == false){
            this.setState({
                isStart2: true
            })
        }

    }
    render() {
        return (
            <div>
                <div className={this.state.isStart2 == false ? 'sStart':'sEnd'}
                style={{height:this.state.oneHeight + 'px'}}
                ></div>
                <canvas id={"chart" + this.props.data._id}  width='1300px'
                height={this.state.oneHeight+ 'px'}> 
                    您的浏览器不支持canvas
                </canvas>   
            
            </div>
        )
    }
}
