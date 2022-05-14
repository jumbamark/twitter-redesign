from django.urls import path
from .views import (
    tweet_detail_view,
    tweets_feed_view, 
    tweets_list_view, 
    tweet_create_view, 
    tweet_delete_view,
    tweet_action_view,
)

'''
CLIENT
Base ENDPOINT: /api/tweets/
'''

app_name = 'tweets'

urlpatterns = [
    path("", tweets_list_view, name="tweetsList"),
    path("feed/", tweets_feed_view, name="feeds"),
    path("create/", tweet_create_view, name="tweet-create"),
    path("action/", tweet_action_view, name="tweet-action"),
    path("<int:tweet_id>/", tweet_detail_view, name="tweet-detail"),
    path("<int:tweet_id>/delete/", tweet_delete_view, name="tweet-delete"),
]