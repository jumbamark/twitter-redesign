from django.urls import path
from .view import  profile_detail_api_view


"""
CLIENT
Base ENDPOINT /api/profiles/
"""

app_name = "profiles"

urlpatterns = [
    path("<str:username>", profile_detail_api_view),
    path("<str:username>/follow/", profile_detail_api_view),
]