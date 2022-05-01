import React, { useState } from 'react'
import {apiTweetAction} from "./Lookup";

function ActionBtn(props) {
    const {id, action, likes} = props
    const [Likes, setLikes] = useState(likes ?  likes : 0)
    // const [userLike, setUserLike] = useState(props.setUserLike ? props.setUserLike: false);
    const className = props.className ? props.className : 'btn btn-primary'
    const actionDisplay = action.display ? action.display : 'Action'

    const handleActionBackendEvent = (response, status) => {
      console.log(response, status);
      if (status === 200) {
        setLikes(response.likes)
        // setUserLike(true)
      }
    }

    const handleClick = (event) => {
      event.preventDefault();
      apiTweetAction(id, action.type, handleActionBackendEvent)
    };

    const display = action.type === 'like' ? `${Likes} ${actionDisplay}` : actionDisplay
  
    return (
      <button className={className} onClick={handleClick}> {display} </button>
    );
}

function ParentTweet({parent}) {
  return (
    parent ?
    <div className="row">
      <div className="col-11 mx-auto p-3 border rounded">
        <p className="mb-0 text-muted small">Retweet</p>
        <Tweet className={" "} id={parent.id} content={parent.content} likes={parent.likes}/>
      </div>
    </div> : null
  )
}
function Tweet(props) {
    const {tweet, id, content, likes, parent} = props
    const className = props.className ? props.className : 'col-12 col-md-10 mx-auto border rounded py-3 mb-4'
    // const action = {type: "like"}
    return (
      <div className={className}>
        <div>
          <p>{id} - {content}</p>
          <ParentTweet parent={parent}/>
        </div>

        <div className="btn btn-group">
          <ActionBtn
            tweet={tweet}
            id={id}
            likes={likes}
            action={{type: "like", display: "Likes"}}
          />
          <ActionBtn tweet={tweet} id={id} action={{type: "unlike", display: "Unlike"}} />
          <ActionBtn tweet={tweet} id={id} action={{type: "retweet", display: "Retweet"}} />
        </div>
      </div>
    );
}

export default Tweet