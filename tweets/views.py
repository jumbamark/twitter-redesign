from django.shortcuts import render
from rest_framework import status


# Create your views here.
def home_view(request, *args, **kwargs):
    username = None
    return render(request, "tweets/feed.html")

def tweets_list_view(request, *args, **kwargs):
    return render(request, "tweets/list.html")

def tweets_detail_view(request, tweet_id, *args, **kwargs):
    return render(request, "tweets/detail.html", context={"tweet_id": tweet_id})