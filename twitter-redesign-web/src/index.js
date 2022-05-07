import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Tweets from './components/Tweets';


const tweetsEl = document.getElementById("tweets");
if (tweetsEl) {
  console.log(tweetsEl.dataset);
  createRoot(tweetsEl).render(<Tweets username={tweetsEl.dataset.username} />);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
  console.log(document.getElementById("root").dataset);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
