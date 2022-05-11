from django.shortcuts import render
from django.http import Http404

from .models import Profiles

# Create your views here.
def profile_detail_view(request, username, *args, **kwargs):
    # get the profile for the passed username
    qs = Profiles.objects.filter(user__username=username)
    if not qs.exists():
        raise Http404
    profile_obj = qs.first()
    context = {
        "username": username,
        "profile": profile_obj
    }
    return render(request, "profiles/detail.html", context)