import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
//eslint-disable-next-line
Object.prototype.$http = axios

//切换显示
//eslint-disable-next-line
Object.prototype.isShow = (ele) =>{    
    if(ele === true){
        return 'block'
    }else{
        return 'none'
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
if (module.hot) {
    module.hot.accept();
}