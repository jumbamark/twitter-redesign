// Grabbing the create -tweet form element by its id
const tweetCreateForm_Element = document.getElementById("tweet-create-form")


// Rendering the create-tweet form error message
const handleTweetFormError = (msg, display) => {
  var myErrorDiv = document.getElementById("tweet-create-form-error")
  if (display === true) {
    // show error
    myErrorDiv.setAttribute("class", "d-block alert alert-danger");
    myErrorDiv.innerText = msg;
  } else {
    // hide error
    myErrorDiv.setAttribute("class", "d-none alert alert-danger")
  }
}

// callback that listens for submit event on the create-tweet form
const handleTweetCreateFormDidSubmit = (event) => {
  event.preventDefault();
  console.log(event.target);
  const myForm = event.target;
  const myFormData = new FormData(myForm);
  for (var myItem of myFormData.entries()) {
    console.log(myItem);
  }
  console.log(myForm.getAttribute("action"));
  // Figure out where the form is going to be send
  const url = myForm.getAttribute("action");
  const method = myForm.getAttribute("method");
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  // setting ajax headers 
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH","XMLHttpRequest");
  xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");

  xhr.onload = function () {
    if (xhr.status === 201) {
      // If there's no error message, toggles it to make it hidden
      handleTweetFormError("", false);
      
      const newTweet = xhr.response;
      console.log(newTweet, xhr.status);
      const newTweetJson = JSON.parse(newTweet);
      const newTweetElement = formatTweetElement(newTweetJson);
      // console.log(newTweetElement);
      const prev_Html = tweetsContainerElement.innerHTML;
      tweetsContainerElement.innerHTML = newTweetElement + prev_Html;
      myForm.reset(); // reserting target form after submitting
    } else if (xhr.status === 400) {
      const errorJson = xhr.response;
      // console.log(errorJson);

      // Rendering the error message
      const error_Json = JSON.parse(errorJson);
      const contentError = error_Json.content;
      let contentErrorMsg;
      if (contentError) {
        contentErrorMsg = contentError[0];
        if (contentErrorMsg) {
          // If there is an error message
          handleTweetFormError(contentErrorMsg, true);
        } else {
          alert("An error occured");
        }
      } else {
        alert("An error occured. Please try again.");
      }
      // console.log(contentErrorMsg);
    } else if (xhr.status === 401) {
      alert("You must login");
      window.location.href = "/login";
    } else if (xhr.status === 403) {
      alert("You must login");
      window.location.href = "/login";
    } else if (xhr.status === 500) {
      alert("There was a server error, please try again");
    };
  };
  // handling errors on the js side
  xhr.onerror = function() {
    alert("A major error occured. Please try again later")
  }
  // sending form data to the server
  xhr.send(myFormData);
}

// Adding an event listener to the form
tweetCreateForm_Element.addEventListener("submit", handleTweetCreateFormDidSubmit)


// Dynamically render the html from javascript
const tweetsContainerElement = document.getElementById("tweets");

const loadTweets = function(tweetsElement) {
  // using  XMLHttpRequest to issue HTTP requests-to exchange data between the site and a server.
  const xhr = new XMLHttpRequest();
  const method = "GET";
  const url = "http://localhost:8000/api/tweets/";
  const responseType = "json";

  // specitying what type of data the response contains
  xhr.responseType = responseType;

  // initializing requests
  xhr.open(method, url);

  // function called when xhr transaction completes successfully.
  xhr.onload = () => {
    // Do something with the retrieved data ( found in xhr.response )
    // console.log(xhr.response);
    const tweets_list = xhr.response;
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
loadTweets(tweetsContainerElement);

// Acquiring csrf_token
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Like Button functionality
const handleTweetActionBtn = (tweet_id, currentCount, action) => {
  // console.log(tweet_id, currentCount);
  const csrftoken = getCookie("csrftoken"); // grabbing the csrf cookie
  const url = "api/tweets/action/"; // DOMString representing the url to send the request to
  const method = "POST";
  const data = JSON.stringify({
    id: tweet_id,
    action: action,
  });
  // creating a new XMLHttpRequest object
  const xhr = new XMLHttpRequest();
  xhr.open(method, url);

  // setting headers
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  
  // setting the csrf_token on the AJAX request
  xhr.setRequestHeader("X-CSRFToken", csrftoken);

  xhr.onload = () => {
    // console.log(xhr.status, xhr.response);
    loadTweets(tweetsContainerElement);  //refreshes all the tweets
  };

  xhr.send(data);
};

function LikeBtn(tweet) {
  return (
    "<button class='btn btn-primary btn-sm' onclick=handleTweetActionBtn(" +
    tweet.id +
    "," +
    tweet.likes +
    ",'like')>" +
    tweet.likes +
    " Likes </button>"
  );
}

function UnLikeBtn(tweet) {
  return (
    "<button class='btn btn-outline-primary btn-sm' onclick=handleTweetActionBtn(" + tweet.id + "," + tweet.likes + ",'unlike')>Unlike</button>"
  );
}

function RetweetBtn(tweet) {
  return (
    "<button class='btn btn-outline-success btn-sm' onclick=handleTweetActionBtn(" + tweet.id + "," + tweet.likes + ",'retweet')>ReTweet</button>"
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
    UnLikeBtn(tweet) +
    RetweetBtn(tweet) +
    "</div></div>";
  return formattedTweet;
}

