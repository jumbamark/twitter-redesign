import React, { useState } from 'react'
// import {apiTweetCreate, TweetsList} from './TweetsList';
import {apiTweetCreate} from "./Lookup";
import TweetsList from "./TweetsList";

function TweetCreate(props) {
    const textAreaRef = React.createRef();
    const {didTweet} = props
  
    const handleBackendUpdate = (response, status) => {
      if (status === 201) {
        didTweet(response);
      } else {
        alert("There was an error");
      }
    };

    const handleSubmit = (event) => {
      event.preventDefault();
      // console.log(event);
      const newTweet = textAreaRef.current.value;
      // backend API request
      apiTweetCreate(newTweet, handleBackendUpdate);
      textAreaRef.current.value = "";
    };

    return (
        <div className="row my-3">
            <div className="col-md-4 mx-auto col-12">
              <form onSubmit={handleSubmit}>
                <textarea
                  ref={textAreaRef}
                  required={true}
                  className="form-control"
                  name="tweet"
                ></textarea>
                <button type="submit" className="btn btn-primary my-3">
                  Tweet
                </button>
              </form>
            </div>
        </div>
    );
}


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