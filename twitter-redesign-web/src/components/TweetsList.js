import React, {useState, useEffect} from "react";
import Tweet from "./Tweet";


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
    callback(xhr.response, xhr.status);
  };

  xhr.onerror = (e) => {
    console.log(e);
    callback({message: "The request was an error"}, 400);
  };

  //  sending the request to the server
  xhr.send();
};


function TweetsList(props) {
    console.log(props.newTweets);  
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);

    // Temporary tweets
    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit);
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweets, tweetsInit, tweets])

    useEffect(() => {
        const myCallback = (response, status) => {
        // console.log(response, status);
        if (status === 200) {
            setTweetsInit(response);
        } else {
            alert("There was an error");
        }
        };
        loadTweets(myCallback);
    }, []);

    return (
        <div>
            {tweets.map((tweet, index) => {
                return <Tweet id={tweet.id} content={tweet.content} key={`${index}-{tweet.id}`} likes={tweet.likes}/>
            })}
        </div>
    )
}

export default TweetsList