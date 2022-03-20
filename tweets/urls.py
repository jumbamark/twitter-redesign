from django.urls import path
from .views import home_view, tweet_detail_view, tweets_list_view, tweet_create_view

app_name = 'tweets'

urlpatterns = [
    path("", home_view, name="homePage"),
    path("create-tweet", tweet_create_view, name="tweet"),
    path("tweets/", tweets_list_view, name="tweetsList"),
    path("tweets/<int:tweet_id>", tweet_detail_view, name="tweetDetails"),
]