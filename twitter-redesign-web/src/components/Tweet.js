import React from 'react'

function ActionBtn(props) {
    const {action, likes,} = props
    const className = props.className ? props.className : 'btn btn-primary'
    const actionDisplay = action.display ? action.display : 'Action'
    const display = action.type === 'like' ? `${likes} ${actionDisplay}` : actionDisplay
    const handleClick = (event) => {
      event.preventDefault();
      if (action.type === 'like') {
        console.log(likes + 1)
      }
    }
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
          <ActionBtn likes={likes} action={{type: "like", display: "Like(s)"}} />
          <ActionBtn action={{type: "unlike", display: "Unlike"}} />
          <ActionBtn action={{type: "retweet", display: "Retweet"}} />
        </div>
      </div>
    );
}

export default Tweet