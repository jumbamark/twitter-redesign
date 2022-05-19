import React, { useEffect, useState } from 'react'
import {apiTweetFeed} from "./Lookup";
import Tweet from "./Tweet";


function FeedList(props) {
    // console.log(props.newTweets);
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState([]);
    const [tweetsDidSet, setTweetsDidSet] = useState(false);

    // Temporary tweets
    useEffect(() => {
    const final = [...props.newTweets].concat(tweetsInit);
    if (final.length !== tweets.length) {
        setTweets(final);
    }
    }, [props.newTweets, tweets, tweetsInit]);

    useEffect(() => {
        if (tweetsDidSet === false) {
        const handleTweetListLookup = (response, status) => {
            // console.log(response, status);
            if (status === 200) {
                setNextUrl(response.next);
                setTweetsInit(response.results);
                setTweetsDidSet(true);
        } else {
            alert("There was an error");
        }
        };
        apiTweetFeed(handleTweetListLookup);
    }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, props.username]);

    const handleDidRetweet = (newTweet) => {
    const updateTweetsInit = [...tweetsInit];
    updateTweetsInit.unshift(newTweet);
    setTweetsInit(updateTweetsInit);
    const updateFinalTweets = [...tweets];
    updateFinalTweets.unshift(tweets);
    setTweets(updateFinalTweets);
    };

    const handleLoadNext = (event) => {
    event.preventDefault();
    const handleLoadNextResponse = (response, status) => {
        console.log();
        if (status === 200) {
        setNextUrl(response.next);
        const newTweets = [...tweets].concat(response.results);
        setTweetsInit(newTweets);
        setTweets(newTweets);
        }
    };
    if (nextUrl !== null) {
        apiTweetFeed(handleLoadNextResponse, nextUrl);
    }
    };

    return (
    <>
        {tweets.map((tweet, index) => {
        return <Tweet tweet={tweet} didRetweet={handleDidRetweet} key={`${index}-{tweet.id}`} />;
        })}
        {nextUrl !== null && (
        <button onClick={handleLoadNext} className="btn btn-outline-primary mb-4">
            Load Next
        </button>
        )}
    </>
    );
}

export default FeedList;