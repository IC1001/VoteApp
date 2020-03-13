import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import cookie from 'react-cookies';
import { BrowserRouter as Router} from "react-router-dom";
//eslint-disable-next-line
axios.interceptors.request.use(function(config){  
    config.headers.Authorization = 'Bearer ' + cookie.load('token')
    return config
  })
Object.prototype.$http = axios
Object.prototype.cookie = cookie
//切换显示
//eslint-disable-next-line
Object.prototype.isShow = (ele) =>{    
    if(ele === true){
        return 'block'
    }else{
        return 'none'
    }
}

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));

serviceWorker.unregister();
if (module.hot) {
    module.hot.accept();
}