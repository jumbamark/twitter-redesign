import React, { useState } from 'react'
import TweetsList from './TweetsList';

function Tweets(props) {
  const textAreaRef = React.createRef()
  const [newTweets, setNewTweets] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event);
    const newTweet = textAreaRef.current.value;
    console.log(newTweet)
    let tempNewTweets = [...newTweets];
    // change this to a server side call
    tempNewTweets.unshift({
      content: newTweet,
      likes: 1,
      id: 100
    })
    setNewTweets(tempNewTweets)
    textAreaRef.current.value = "";
  }

  return (
    <div className="container">
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
      <TweetsList newTweets={newTweets}/>
    </div>
  );
}

export default Tweets