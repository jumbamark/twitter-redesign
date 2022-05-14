from django.urls import path
from .view import user_follow_view

app_name = "profiles"

urlpatterns = [
    path("edit/", user_follow_view),
]