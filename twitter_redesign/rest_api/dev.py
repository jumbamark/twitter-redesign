from rest_framework import authentication
from django.contrib.auth.models import User


class devAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        qs = User.objects.filter(id=3)
        user = qs.order_by("?").first()
        return (user, None)