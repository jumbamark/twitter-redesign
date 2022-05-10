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

const lookup = (method, endpoint, callback, data) => {
  let jsonData;
  if (data) {
    jsonData = JSON.stringify(data);
  }

  // using  XMLHttpRequest to issue HTTP requests-to exchange data between the site and a server.
  const xhr = new XMLHttpRequest();
  // const method = "GET";
  const url = `http://127.0.0.1:8000/api/${endpoint}`;

  const csrftoken = getCookie("csrftoken"); // grabbing the csrf cookie
  // initializing requests
  xhr.open(method, url);
  // specitying what type of data the response contains
  xhr.responseType = "json";
  xhr.setRequestHeader("Content-Type", "application/json");

  if (csrftoken) {
    // xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
  }

  // function called when xhr transaction completes successfully.
  xhr.onload = () => {
    // Do something with the retrieved data ( found in xhr.response )
    // console.log(xhr.response, xhr.status);
    if (xhr.status === 403) {
      const detail = xhr.response.detail;
      if (detail === "Authentication credentials were not provided.") {
        window.location.href = "/login?showLoginRequired=true";
      }
    }
    callback(xhr.response, xhr.status);
  };

  xhr.onerror = (e) => {
    console.log("error", e);
    callback({message: "The request was an error"}, 400);
  };

  //  sending the request to the server
  xhr.send(jsonData);
};

const apiTweetCreate = (newTweet, callback) => {
  lookup("POST", "tweets/create/", callback, {content: newTweet});
  console.log();
};

const apiTweetAction = (tweetId, action, callback) => {
    const data = {id: tweetId, action: action};
    lookup("POST", "tweets/action/",callback, data);
}

const apiTweetList = function (username, callback) {
  let endpoint = "tweets/";
  if (username) {
    endpoint = `tweets/?username=${username}`;
  }
  lookup("GET", endpoint, callback);
};

const apiTweetDetail = (tweetId, callback) => {
  lookup("GET", `tweets/${tweetId}/`, callback);
}


export {apiTweetCreate, apiTweetAction, apiTweetList, apiTweetDetail};