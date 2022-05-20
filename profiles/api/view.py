from django.contrib.auth import get_user_model
from django.conf import settings
from django.shortcuts import render, redirect

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Profile
from ..serializers import PublicProfileSerializer

User = get_user_model()
ALLOWED_HOSTS = settings.ALLOWED_HOSTS

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_follow_view(request, username, *args, **kwargs):
    current_user = request.user
    user_to_follow_qs = User.objects.filter(username=username)
    if current_user.username == username:
        my_followers = current_user.profile.followers.all()
        return Response({"count": my_followers.count(), "message": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
    if user_to_follow_qs.exists() == False:   #if not user_to_follow.qs.exists
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    user_to_follow = user_to_follow_qs.first()
    profile = user_to_follow.profile
    data = {}
    try:
        data = request.data
    except:
        pass
    # data = request.data or {}
    print(data)
    action = data.get("action")
    if action == "follow":
        profile.followers.add(current_user)
    elif action == "unfollow":
        profile.followers.remove(current_user)
    else:
        pass
    # current_followers_qs = profile.followers.all()
    data = PublicProfileSerializer(instance=profile, context={"request":request})
    return Response(data.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def profile_detail_api_view(request, username, *args, **kwargs):
    # get the profile for the passed username
    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
        return Response({"detail":"User not found"}, status=status.HTTP_404_NOT_FOUND)
    profile_obj = qs.first()
    data = PublicProfileSerializer(instance=profile_obj, context={"request": request})
    return Response(data.data, status=status.HTTP_200_OK)
