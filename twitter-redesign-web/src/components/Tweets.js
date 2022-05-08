import React, { useState } from 'react'
import TweetCreate from './TweetCreate';
import {TweetsList} from "./TweetsList";


function Tweets(props) {
  console.log(props)
  const [newTweets, setNewTweets] = useState([])
  const canTweet = props.canTweet === "false" ? false : true

  const handleNewTweet = (newTweet) => {
    let tempNewTweets = [...newTweets];
      tempNewTweets.unshift(newTweet);
      setNewTweets(tempNewTweets);
  };

  return (
    <div className="container text-center">
      <div className="row my-3">
        {canTweet === true && (
          <TweetCreate didTweet={handleNewTweet}/>
        )}
      </div>
      <TweetsList newTweets={newTweets} {...props}/>
    </div>
  );
}

export default Tweets