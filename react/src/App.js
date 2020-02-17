import React from 'react';
import './assets/css/App.css';
import { hot } from 'react-hot-loader/root';
import Nav from './components/Nav'
import Vote  from './components/Vote'
import VoteCreate  from './components/VoteCreate'
function App() {
  return (
    <div className="App">
      <Nav />
      <Vote />
      <VoteCreate />
    </div>
  );
}

// export default App;
export default hot(App)