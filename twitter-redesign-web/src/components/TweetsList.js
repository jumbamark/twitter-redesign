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
    }, [props.newTweets, tweetsInit, tweets])

    useEffect(() => {
        if (tweetsDidSet === false) {
            const myCallback = (response, status) => {
                // console.log(response, status);
                if (status === 200) {
                    setTweetsInit(response);
                    setTweetsDidSet(true);
                } else {
                    alert("There was an error");
                }
            };
            apiTweetList(myCallback);
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet]);

    return (
        <div>
            {tweets.map((tweet, index) => {
                return <Tweet id={tweet.id} content={tweet.content} key={`${index}-{tweet.id}`} likes={tweet.likes}/>
            })}
        </div>
    )
}

export  default TweetsList;