import './App.css';
import React, {useState, useEffect} from 'react';



const loadTweets = function (callback) {
  // using  XMLHttpRequest to issue HTTP requests-to exchange data between the site and a server.
  const xhr = new XMLHttpRequest();
  const method = "GET";
  const url = "http://127.0.0.1:8000/api/tweets/";
  const responseType = "json";

  // specitying what type of data the response contains
  xhr.responseType = responseType;

  // initializing requests
  xhr.open(method, url);

  // function called when xhr transaction completes successfully.
  xhr.onload = () => {
    // Do something with the retrieved data ( found in xhr.response )
    // console.log(xhr.response);
    callback(xhr.response, xhr.status)
  };

  xhr.onerror = (e) => {
    console.log(e);
    callback({"message": "The request was an error"}, 400)
  }

  //  sending the request to the server
  xhr.send();
};

function Tweet(props) {
  const {tweet} = props;
  return <div>
    <p>{tweet.id} - {tweet.content}</p>
  </div>
}

function App() {
  const [tweets, setTweets] = useState([])

  useEffect(() => {
    const myCallback = (response, status) => {
      console.log(response, status)
      if (status === 200) {
        setTweets(response);
      } else {
        alert("There was an error")
      }
    }
    loadTweets(myCallback)
  }, [])

  return (
      <div className="app">
        <div>
          {tweets.map((item, index) => {
            return (
              <Tweet
                tweet={item}
                className="col-12 col-md-10 mx-auto border rounded py-3 mb-4"
                key={`${index}-{item.id}`}
              />
            );
          })}
        </div>
      </div>
  );
}

export default App;
