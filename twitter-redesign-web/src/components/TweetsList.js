import React, {useState, useEffect} from "react";
import Tweet from "./Tweet";
import {apiTweetList} from "./Lookup";
import {apiTweetDetail} from "./Lookup";

function TweetDetail(props) {
    const {tweetId} = props;
    const [didLookup, setDidLookup] = useState(false);
    const [tweet, setTweet] = useState(null);

    const handleBackendLookup = (response, status) => {
        if (status === 200) {
            setTweet(response)
        } else {
            alert("There was an error finding your tweet")
        }
    }

    useEffect(() => {
        if (didLookup === false) {
            apiTweetDetail(tweetId, handleBackendLookup);
            setDidLookup(true);
        }
    }, [didLookup, setDidLookup, tweetId])

    return (
        tweet === null ? null :
        <Tweet tweet={tweet} className={props.className}/>
    )
}


function TweetsList(props) {
    // console.log(props.newTweets);
    const [tweetsInit, setTweetsInit] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [nextUrl, setNextUrl] = useState([])
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
                    setNextUrl(response.next)
                    setTweetsInit(response.results);
                    setTweetsDidSet(true);
                } else {
                    alert("There was an error");
                }
            };
            apiTweetList(props.username, handleTweetListLookup);
        }
    }, [tweetsInit, tweetsDidSet, setTweetsDidSet, props.username]);

    const handleDidRetweet = (newTweet) => {
        const updateTweetsInit = [...tweetsInit];
        updateTweetsInit.unshift(newTweet);
        setTweetsInit(updateTweetsInit)
        const updateFinalTweets = [...tweets];
        updateFinalTweets.unshift(tweets);
        setTweets(updateFinalTweets);
    }

    return (
        <>
            {tweets.map((tweet, index) => {
                return <Tweet tweet={tweet} didRetweet={handleDidRetweet} key={`${index}-{tweet.id}`}/>
            })}
            {nextUrl !== null && <button className="btn btn-outline-primary mb-4">Load Next</button>}
        </>
    )
}

export  {TweetDetail, TweetsList};