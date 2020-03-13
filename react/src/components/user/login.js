import React, { Component } from 'react'
import '../../assets/css/user.css';
import { Form, Input, Button } from 'antd';
export default class login extends Component {
    constructor(props) {
        super(props);
        this.state={
            name:''
        }
    }

    user_login = (e) => {
        e.preventDefault();
        let username = this.refs.username.state.value
        let password = this.refs.password.state.value
        // const [form] = Form.useForm();
        // let xx = form.getFieldValue('username')
        this.$http.post('login',{username, password})
        .then(res=>{

            if(res.data.code == 0) {
                alert('用户名或密码错误')
            }else{
                this.setState({
                    name: res.data.username
                })
                this.props.isLogin(this, res.data.username)
                this.props.quitLogin()
            }
        })
        
    }

    render() {
        return (
            <div>
                <div className="login" style={{height:'350px'}}>
                <div className="login_title">登录</div>
                <Form
                    name="basic"
                    initialValues={{
                        remember: true,
                    }}
                    onSubmit={this.user_login}
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
                        <Input ref="username" />
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
                        <Input type="password" ref="password" />
                    </Form.Item>

                    {/* 按钮 */}
                    <Form.Item>
                    <div className="login_btn">
                        <div>
                            <Button type="primary" htmlType="submit">
                            登录
                            </Button>
                        </div>
                        <div>
                            <Button type="primary" onClick={this.props.toRegister}>
                            前往注册
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
