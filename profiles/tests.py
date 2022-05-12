from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()

class ProfileTestCase(TestCase):
    def setUp(self):
        self.userA = User.objects.create_user(username='testuser', password='testpasswd')
        self.userB = User.objects.create_user(username='test', password='passwd')
    
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