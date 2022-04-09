import React from 'react'

function ActionBtn(props) {
    const {action, likes} = props
    const className = props.className ? props.className : 'btn btn-primary'
    return (
        action.type === "like" ? <button className={className}> {likes} Likes </button> : null
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
          <ActionBtn likes={likes} action={{type: "like"}} />
        </div>
      </div>
    );
}

export default Tweet