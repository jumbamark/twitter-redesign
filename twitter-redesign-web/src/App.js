import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [tweets, setTweets] = useState([])
  const performLookup = () => {
    // do my lookup
    const tweetItems = [{"content": 123}, {"content": "Hello world"}]
    setTweets(tweetItems)
  }
  useEffect(performLookup, []) 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{tweets.map((tweet, index) => {
          return <li>{tweet.content}</li>
        })}</p>
      </header>
    </div>
  );
}

export default App;
