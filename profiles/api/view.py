from django.contrib.auth import get_user_model
from django.conf import settings
from django.shortcuts import render, redirect
from django.http import HttpReponse, Http404, JsonResponse

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from ..models import Profile

User = get_user_model()
ALLOWED_HOSTS = settings.ALLOWED_HOSTS

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_follow_view(request, username, *args, **kwargs):
    current_user = request.user
    user_to_follow_qs = User.objects.filter(username=username)
    if user_to_follow_qs.exists() == False:   #if not user_to_follow.qs.exists
        return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
    user_to_follow = user_to_follow_qs.first()
    profile = user_to_follow.profile
    if current_user in profile.followers.all():
        profile.followers.remove(current_user)
    else:
        profile.followers.add(current_user)
    return Response({"followers":profile.followers.all()}, status=status.HTTP_400_BAD_REQUEST)

