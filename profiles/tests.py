from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from .models import Profile


# Create your tests here.


User = get_user_model()
class ProfileTestCase(TestCase):
    def setUp(self):
        self.userA = User.objects.create_user(username='testuser', password='testpasswd')
        self.userB = User.objects.create_user(username='test', password='passwd')

    def get_client(self):
        client = APIClient()
        client.login(username=self.userA.username, password="testpasswd")
        return client

    def test_profile_created_via_signal(self):
        """
        Test that a profile is created automatically when a user is created
        """
        queryset = Profile.objects.all()
        self.assertEqual(queryset.count(), 2)

    def test_following(self):
        first = self.userA
        second = self.userB
        first.profile.followers.add(second) # adds second user to the followers of the first user
        second_user_following_whom = second.following.all()
        qs = second_user_following_whom.filter(user=first)
        self.assertTrue(qs.exists())
        first_user_following_no_one = first.following.all()
        self.assertFalse(first_user_following_no_one.exists())

    def test_follow_api_endpoint(self):
        client = self.get_client()
        response = client.post(f"/api/profiles/{self.userB.username}/follow/", {"action":"follow"})
        res_data = response.json()
        followers = res_data.get("followers")
        self.assertEqual(followers, 1)

    def test_unfollow_api_endpoint(self):
        first = self.userA
        second = self.userB
        first.profile.followers.add(second)
        client = self.get_client()
        response = client.post(f"/api/profiles/{self.userB.username}/follow/", {"action":"unfollow"})
        res_data = response.json()
        followers = res_data.get("followers")
        self.assertEqual(followers, 0)

    def test_cannot_follow_api_endpoint(self):
        client = self.get_client()
        response = client.post(f"/api/profiles/{self.userA.username}/follow/", {"action":"follow"})
        res_data = response.json()
        followers = res_data.get("count")
        self.assertEqual(followers, 0)