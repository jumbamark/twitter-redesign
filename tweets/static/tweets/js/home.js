// Grabbing the create -tweet form element by its id
const tweetCreateForm_Element = document.getElementById("tweet-create-form")

// callback that listens for submit event on the create-tweet form
const handleTweetCreateFormDidSubmit = (event) => {
  event.preventDefault();
  console.log(event.target);
  const myForm = event.target;
  const myFormData = new FormData(myForm);
  for (var myItem of myFormData.entries()) {
    console.log(myItem);  // key vale pairs related to every single input in the form
    console.log(myForm.getAttribute("action"));
    const url = myForm.getAttribute("action");
    const method = myForm.getAttribute("method");
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.onload = function() {
      const serverResponse = xhr.response
      console.log(serverResponse);

      // reload the tweets after it successfully loads
      const tweets_Element = document.getElementById("tweets");
      loadTweets(tweets_Element);
    }
    // sending form data to the server
    xhr.send(myFormData)
  }
}

// Adding an event listener to the form
tweetCreateForm_Element.addEventListener("submit", handleTweetCreateFormDidSubmit)


// Dynamically render the html from javascript
const tweets_Element = document.getElementById("tweets");

const loadTweets = function(tweetsElement) {
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
      // console.log(i);
      // console.log(tweets_list[i]);
      tweetObj = tweets_list[i];
      let currentItem = formatTweetElement(tweetObj);
      finalTweetStri += currentItem;
    }

    tweetsElement.innerHTML = finalTweetStri;
  };

  //  sending the request to the server
  xhr.send();
}

// calling the function to load tweets to the home.html page
loadTweets(tweets_Element);


const handleDidLike = (tweet_id, currentCount) => {
  console.log(tweet_id, currentCount);
};

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


function formatTweetElement(tweet) {
  let formattedTweet =
    "<div class='col-12 col-md-10 mx-auto border rounded py-3 mb-4 tweet' id='tweet- " +
    tweet.id +
    " '><p>" +
    tweet.content +
    "</p><div class='btn-group'>" +
    LikeBtn(tweet) +
    "</div></div>";
  return formattedTweet;
}

