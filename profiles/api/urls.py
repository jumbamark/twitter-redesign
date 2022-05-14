from django.urls import path
from .view import user_follow_view


"""
CLIENT
Base ENDPOINT /api/profiles/
"""

app_name = "profiles"

urlpatterns = [
    path("<str:username>/follow/", user_follow_view),
]