import React, {useState, useEffect} from "react";
import Tweet from "./Tweet";


// Acquiring csrf_token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}


const lookup = (method, endpoint, callback, data) => {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data);
  }

  // using  XMLHttpRequest to issue HTTP requests-to exchange data between the site and a server.
  const xhr = new XMLHttpRequest();
  // const method = "GET";
  const url = `http://127.0.0.1:8000/api/${endpoint}`;
  // specitying what type of data the response contains
  xhr.responseType = "json";
  const csrftoken = getCookie("csrftoken"); // grabbing the csrf cookie
  // initializing requests
  xhr.open(method, url);
  xhr.setRequestHeader("Content-Type", "application/json");

  if (csrftoken) {
    // xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }

  // function called when xhr transaction completes successfully.
  xhr.onload = () => {
    // Do something with the retrieved data ( found in xhr.response )
    // console.log(xhr.response);
    callback(xhr.response, xhr.status);
  };

  xhr.onerror = (e) => {
    console.log(e);
    callback({message: "The request was an error"}, 400);
  };

  //  sending the request to the server
  xhr.send(jsonData);
};;


const createTweet = (newTweet, callback) => {
    lookup("POST", "tweets/create/", callback, {content: newTweet})
}


const loadTweets = function (callback) {
    lookup("GET", "tweets/",  callback)
};


function TweetsList(props) {
    console.log(props.newTweets);  
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [tweetsDidSet, setTweetsDidSet] = useState(false);

    // Temporary tweets
    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit);
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweets, tweetsInit, tweets])

    useEffect(() => {
        if (tweetsDidSet === false) {
            const myCallback = (response, status) => {
                // console.log(response, status);
                if (status === 200) {
                    setTweetsInit(response);
                    setTweetsDidSet(true);
                } else {
                    alert("There was an error");
                }
            };
            loadTweets(myCallback);
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet]);

    return (
        <div>
            {tweets.map((tweet, index) => {
                return <Tweet id={tweet.id} content={tweet.content} key={`${index}-{tweet.id}`} likes={tweet.likes}/>
            })}
        </div>
    )
}

export  {TweetsList, createTweet};