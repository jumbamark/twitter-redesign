import React from 'react'
import {apiTweetCreate} from "./Lookup";


function TweetCreate(props) {
    const textAreaRef = React.createRef();
    const {didTweet} = props;
    
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

export default TweetCreate