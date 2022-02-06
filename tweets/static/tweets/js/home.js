// using  XMLHttpRequest to issue HTTP requests-to exchange data between the site and a server.
const xhr = new XMLHttpRequest();
const method = "GET";
const url = "/tweets";
const responseType = "json";

// specitying what type of data the response contains
xhr.responseType = responseType;

// initializing requests
xhr.open(method, url);

// function called when xhr transaction completes successfully.
xhr.onload = () => {
  // Do something with the retrieved data ( found in xhr.response )
  console.log(xhr.response);
  const tweets_list = xhr.response.response;
  console.log(tweets_list);
  let finalTweetStri = "";

  for (let i = 0; i < tweets_list.length; i++) {
    console.log(i);
    console.log(tweets_list[i]);
    tweetObj = tweets_list[i];
    let currentItem = formatTweetElement(tweetObj);
    finalTweetStri += currentItem;
  }

  tweetsElement.innerHTML = finalTweetStri;
};

//  sending the request to the server
xhr.send();

// Dynamically render the html from javascript
const tweetsElement = document.getElementById("tweets");

function formatTweetElement(tweet) {
  let formattedTweet =
    "<div class='mb-4 tweet' id='tweet- " +
    tweet.id +
    " '><p>" +
    tweet.content +
    "</p><div class='btn-group'>" +
    LikeBtn(tweet) +
    "</div></div>";
  return formattedTweet;
}

function LikeBtn(tweet) {
  return (
    "<button class='btn btn-primary btn-sm' onclick=handleDidLike(" +
    tweet.id +
    "," +
    tweet.likes +
    ")>" +
    tweet.likes +
    " Likes </button>"
  );
}

const handleDidLike = (tweet_id, currentCount) => {
  console.log(tweet_id, currentCount);
};
