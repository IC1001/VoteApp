import React from 'react';
import './assets/css/App.css';
import { hot } from 'react-hot-loader/root';
import Nav from './components/Nav'
import Vote  from './components/Vote'
import Collection  from './components/Collection'
import VoteCreate  from './components/VoteCreate'
import { BrowserRouter as Router, Route, Link,Switch,Redirect } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Nav />
      {/* <Vote /> */}
      <VoteCreate />
      <Switch>
        
        <Route path="/mine" component={Vote}></Route>
        <Route path="/collect" component={Vote}></Route>
        <Route path="/history" component={Vote}></Route>
        <Route path="/" component={Vote}></Route>
        <Redirect to="/"></Redirect>
        

      </Switch>      
    </div>
  );
}

// export default App;
export default hot(App)