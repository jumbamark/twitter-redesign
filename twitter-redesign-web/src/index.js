import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Tweets from './components/Tweets';
import Feeds from "./components/Feeds";
import {TweetDetail} from './components/TweetsList';

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}


const e = React.createElement
const tweetsEl = document.getElementById("tweets");
if (tweetsEl) {
  createRoot(tweetsEl).render(e(Tweets, tweetsEl.dataset));
}


const tweetDetailElements = document.querySelectorAll(".tweet-detail");
tweetDetailElements.forEach(container => {
  createRoot(container).render(e(TweetDetail, container.dataset));
})

const tweetsFeedEl = document.getElementById("tweets-feed");
if (tweetsFeedEl) {
  createRoot(tweetsFeedEl).render(e(Feeds, tweetsFeedEl.dataset));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();