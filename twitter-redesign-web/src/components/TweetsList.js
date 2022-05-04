import React, {useState, useEffect} from "react";
import Tweet from "./Tweet";
import {apiTweetList} from "./Lookup";


function TweetsList(props) {
    // console.log(props.newTweets);
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [tweetsDidSet, setTweetsDidSet] = useState(false);

    // Temporary tweets
    useEffect(() => {
        const final = [...props.newTweets].concat(tweetsInit);
        if (final.length !== tweets.length) {
            setTweets(final)
        }
    }, [props.newTweets, tweets, tweetsInit])

    useEffect(() => {
        if (tweetsDidSet === false) {
            const handleTweetListLookup = (response, status) => {
                // console.log(response, status);
                if (status === 200) {
                    setTweetsInit(response);
                    setTweetsDidSet(true);
                } else {
                    alert("There was an error");
                }
            };
            apiTweetList(handleTweetListLookup);
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet]);

    const handleDidRetweet = (newTweet) => {
        const updateTweetsInit = [...tweetsInit];
        updateTweetsInit.unshift(newTweet);
        setTweetsInit(updateTweetsInit)
        const updateFinalTweets = [...tweets];
        updateFinalTweets.unshift(tweets);
        setTweets(updateFinalTweets);
    }

    return (
        <div>
            {tweets.map((tweet, index) => {
                return <Tweet tweet={tweet} didRetweet={handleDidRetweet} key={`${index}-{tweet.id}`}/>
            })}
        </div>
    )
}

export  default TweetsList;