from django.test import TestCase
from .models import Tweet
from django.contrib.auth import get_user_model

# Create your tests here.
User = get_user_model()
class TweetTestCase(TestCase):
    def setUp(self):
        # Create a user
        User.objects.create_user(username="mercy", password="lapik")
        self.user = User.objects.create_user(username="jumba", password="airam")
    
    # test user exists
    def test_user_created(self):
        user = User.objects.get(username="mercy")
        self.assertEqual(user.username, "mercy")
        self.assertEqual(self.user.username, "jumba")