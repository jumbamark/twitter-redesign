var path = window.location.pathname,
  idRegex = /(?<tweetid>\d+)/,
  match = path.match(idRegex);
if (match) {
  var tweetId = match.groups.tweetid,
    tweetsEl = document.getElementById("tweets");
  tweetsEl.className = "d-none";
  var tweetEl =
      " <div class='tweet-detail' data-tweet-id=" +
      tweetId +
      " data-class-name='col-6 mx-auto pt-2'></div> ",
    mainContainer = document.getElementById("tweet-container");
  mainContainer.innerHTML = tweetEl;
}
