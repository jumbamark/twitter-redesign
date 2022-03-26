from django.urls import path
from .views import (
    home_view, 
    tweet_detail_view, 
    tweets_list_view, 
    tweet_create_view, 
    tweet_delete_view,
    tweet_action_view,
)

app_name = 'tweets'

urlpatterns = [
    path("", home_view, name="homePage"),
    path("create-tweet", tweet_create_view, name="tweet-create"),
    path("tweets/", tweets_list_view, name="tweetsList"),
    path("tweets/<int:tweet_id>", tweet_detail_view, name="tweet-detail"),
    path("api/tweets/<int:tweet_id>/delete", tweet_delete_view, name="tweet-delete"),
    path("api/tweets/action", tweet_action_view, name="tweet-action"),
]