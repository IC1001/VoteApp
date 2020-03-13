import React, { Component } from 'react'
import '../../assets/css/user.css';
import { Form, Input, Button, Checkbox } from 'antd';
export default class register extends Component {
    constructor(props) {
        super(props);
        this.state={
            isExist: false
        }
    }
    user_register = (e) => {
        e.preventDefault();
        let username = this.refs.username.state.value
        let password = this.refs.password.state.value
        let confirm = this.refs.confirm.state.value
        if(username.length < 2) {
            alert('用户名不小于两位')
            return
        }
        if(password != confirm) {
            alert('密码不一致')
            return
        }
        if(password.length < 6){
            alert('密码长度不能小于6位')
        }
        // const [form] = Form.useForm();
        // let xx = form.getFieldValue('username')
        this.$http.post('register',{username, password})
        .then(res=>{
            console.log(res);
            
            if(res.data.code == 0) {
                alert('用户名已存在')
            }else{
                this.props.quitLogin()
            }
            // this.props.isRegister()
            
        })
        
    }
    // 判断用户名是否存在
    isExist = () => {
        let username = this.refs.username.state.value
        this.$http.post('exist',{username})
        .then(res=>{
            if(res.data.code == 0) {
                this.setState({
                    isExist: true
                })
            }else{
                this.setState({
                    isExist: false
                }) 
            }
        })
    }

    render() {
        return (
            <div>
                <div className="login">
                <div className="login_title">注册账号</div>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onSubmit={this.user_register}
                    // onFinish={this.onFinish}
                    // onFinishFailed={this.onFinishFailed}
                >   
                    {/* 用户名 */}
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                        ]}
                    >
                        <Input placeholder="用户名：" ref="username" onBlur={this.isExist} />
                        <div className="existTips" style={{display:this.isShow(this.state.isExist)}}>*用户名已存在</div>
                    </Form.Item>
                    {/* 密码 */}
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        ]}
                    >
                        <Input type="password" placeholder="密码：" ref="password" />
                    </Form.Item>
                    <Form.Item
                        label="Confirm"
                        name="confirm"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                        ]}
                    >
                        <Input type="password" placeholder="确认密码：" ref="confirm"/>
                    </Form.Item>
                    {/* 按钮 */}
                    <Form.Item >
                        <div className="login_btn">
                            <div>
                                <Button type="primary" onClick={this.props.toLogin}>
                                前往登录
                                </Button>
                            </div>
                            <div>
                                <Button type="primary" htmlType="submit">
                                注册
                                </Button>
                            </div>
                        </div>
                    </Form.Item>
                    </Form>                    
                </div>
                <div className="loginModel" onClick={this.props.quitLogin}></div>
            </div>
        )
    }
}
