import React, {useState} from "react";
import TweetCreate from "./TweetCreate";
import FeedList from "./FeedList";

function Feeds(props) {
    console.log(props);
    const [newTweets, setNewTweets] = useState([]);
    const canTweet = props.canTweet === "false" ? false : true;

    const handleNewTweet = (newTweet) => {
        let tempNewTweets = [...newTweets];
        tempNewTweets.unshift(newTweet);
        setNewTweets(tempNewTweets);
    };

    return (
    <>
        <div className="row my-3">
        {canTweet === true && <TweetCreate didTweet={handleNewTweet} />}
        </div>
        <FeedList newTweets={newTweets} {...props} />
    </>
    );
}

export default Feeds;
