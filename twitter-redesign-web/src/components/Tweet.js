import React from 'react'

function Tweet(props) {
    const {id, content} = props
    const className = props.className ? props.className : 'col-12 col-md-10 mx-auto border rounded py-3 mb-4'
    return (
        <div className={className}>
            <p>{id} - {content}</p>
        </div>
    );
}

export default Tweet