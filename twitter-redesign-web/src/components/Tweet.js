import React, { useState } from 'react'
import {apiTweetAction} from "./Lookup";

function ActionBtn(props) {
    const {tweet, action, didPerformAction} = props
    const likes = tweet.likes ? tweet.likes : 0;
    const className = props.className ? props.className : 'btn btn-primary'
    const actionDisplay = action.display ? action.display : 'Action'

    const handleActionBackendEvent = (response, status) => {
      console.log(response, status);
      if ((status === 200 || status === 201) && didPerformAction) {
        didPerformAction(response, status)
      }
    }

    const handleClick = (event) => {
      event.preventDefault();
      apiTweetAction(tweet.id, action.type, handleActionBackendEvent)
    };

    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
  
    return (
      <button className={className} onClick={handleClick}> {display} </button>
    );
}

function ParentTweet({tweet}) {
  return (
    tweet.parent ?
    <div className="row">
      <div className="col-11 mx-auto p-3 border rounded">
        <p className="mb-0 text-muted small">Retweet</p>
        <Tweet className={" "} tweet={tweet.parent}/>
      </div>
    </div> : null
  )
}
function Tweet(props) {
    const {tweet} = props
    const [actionTweet, setActionTweet] = useState(tweet ? tweet : null)
    const className = props.className ? props.className : 'col-12 col-md-10 mx-auto border rounded py-3 mb-4'
    // const action = {type: "like"}

    const handlePerformAction = (newActionTweet, status) => {
      if (status === 200) {
        setActionTweet(newActionTweet);
      } else if (status === 201) {
        // let the TweetList know
      }
    }

    return (
      <div className={className}>
        <div>
          <p>{tweet.id} - {tweet.content}</p>
          <ParentTweet tweet={tweet}/>
        </div>

        {actionTweet && <div className="btn btn-group">
          <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type: "like", display: "Likes"}} />
          <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type: "unlike", display: "Unlike"}} />
          <ActionBtn tweet={actionTweet} didPerformAction={handlePerformAction} action={{type: "retweet", display: "Retweet"}} />
        </div>}
      </div>
    );
}

export default Tweet