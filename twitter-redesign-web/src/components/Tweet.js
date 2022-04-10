import React, { useState } from 'react'

function ActionBtn(props) {
    const {action, likes} = props
    const [Likes, setLikes] = useState(likes ?  likes : 0)
    const [userLike, setUserLike] = useState(false);
    const className = props.className ? props.className : 'btn btn-primary'
    const actionDisplay = action.display ? action.display : 'Action'

    const handleClick = (event) => {
      event.preventDefault();
      if (action.type === "like") {
        if (userLike === true) {
          // perhaps I unlike it
          setLikes(Likes - 1);
          setUserLike(false)
        } else {
          setLikes(Likes + 1);
          setUserLike(true)
        }
      }
    };

    const display = action.type === 'like' ? `${Likes} ${actionDisplay}` : actionDisplay
  
    return (
      <button className={className} onClick={handleClick}> {display} </button>
    );
}

function Tweet(props) {
    const {id, content, likes} = props
    const className = props.className ? props.className : 'col-12 col-md-10 mx-auto border rounded py-3 mb-4'
    // const action = {type: "like"}
    return (
      <div className={className}>
        <p>
          {id} - {content}
        </p>
        <div className="btn btn-group">
          <ActionBtn likes={likes} action={{type: "like", display: "Likes"}} />
          <ActionBtn action={{type: "unlike", display: "Unlike"}} />
          <ActionBtn action={{type: "retweet", display: "Retweet"}} />
        </div>
      </div>
    );
}

export default Tweet