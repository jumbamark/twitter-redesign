from django.test import TestCase
from .models import Tweet
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


# Create your tests here.
User = get_user_model()
class TweetTestCase(TestCase):
    def setUp(self):
        # Create a user
        self.user = User.objects.create_user(username="mercy", password="airam")
        self.user2 = User.objects.create_user(username="mark", password="lapik")
        # creating tweet objects in the test database
        Tweet.objects.create(content="my first tweet", user=self.user)
        self.tweet2 = Tweet.objects.create(content="my second tweet", user=self.user2)
        self.tweet3 = Tweet.objects.create(content="my third tweet", user=self.user)
        self.tweet4 = Tweet.objects.create(content="my fourth tweet", user=self.user)
        print(self.tweet4.id)
        self.currentCount = Tweet.objects.all().count()
    
    # test user exists
    def test_tweet_created(self):
        tweet = Tweet.objects.create(content="my fifth tweet", user=self.user)
        self.assertEqual(tweet.content, "my fifth tweet")
        self.assertEqual(tweet.is_retweet, False)
        self.assertEqual(tweet.user, self.user)
    
    def get_client(self):
        client = APIClient()
        client.login(username=self.user.username, password="airam")
        return client

    def test_tweet_list(self):
        client = self.get_client()
        response = client.get("/api/tweets/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 4)
        # print(response.json())

    def test_action_like(self):
        client = self.get_client()
        response = client.post("/api/tweets/action/", {"id": 1, "action": "like"})
        self.assertEqual(response.status_code, 200)
        like_count = response.json().get("likes")
        self.assertEqual(like_count, 1)
        # print(response.json())

    def test_action_unlike(self):
        client = self.get_client()
        tweet_obj = Tweet.objects.get(id=self.tweet3.id)
        response = client.post("/api/tweets/action/", {"id": tweet_obj.id, "action": "like"})
        self.assertEqual(response.status_code, 200)
        response = client.post("/api/tweets/action/", {"id": tweet_obj.id, "action": "unlike"})
        self.assertEqual(response.status_code, 200)
        print(response.json())
        like_count = response.json().get("likes")
        self.assertEqual(like_count, 0)

    def test_action_retweet(self):
        client = self.get_client()
        current_count = self.currentCount
        response = client.post("/api/tweets/action/", {"id": self.tweet4.id, "action": "retweet"})
        self.assertEqual(response.status_code, 201) 
        data = response.json()
        new_tweet_id = data.get("id")
        self.assertNotEqual(self.tweet4.id, new_tweet_id)
        self.assertEqual(current_count + 1, 5)

    def test_tweet_create_api_view(self):
        request_data = {"content": "This is my test tweet"}
        client = self.get_client()
        response = client.post("/api/tweets/create/", request_data)
        self.assertEqual(response.status_code, 201)
        response_data = response.json()
        new_tweet_id = response_data.get("id")
        self.assertEqual(self.currentCount + 1, 5)

    def test_tweet_detail_api_view(self):
        client = self.get_client()
        response = client.get(f"/api/tweets/{self.tweet4.id}/") 
        self.assertEqual(response.status_code, 200)
        data = response.json()
        _id = data.get("id")
        self.assertEqual(_id, self.tweet4.id)

    def test_tweet_delete_api_view(self):
        client = self.get_client()
        response = client.delete(f"/api/tweets/{self.tweet4.id}/delete/") 
        self.assertEqual(response.status_code, 204)
        response = client.delete(f"/api/tweets/{self.tweet4.id}/delete/") 
        self.assertEqual(response.status_code, 404)
        response_incorrect_owner = client.delete(f"/api/tweets/{self.tweet2.id}/delete/") 
        self.assertEqual(response_incorrect_owner.status_code, 401)  # permissions error