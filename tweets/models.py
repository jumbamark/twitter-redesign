from django.db import models
from django.conf import settings

# Referencing a built-in django feature for the User model
User = settings.AUTH_USER_MODEL

# Record the time a tweet was liked
class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # user who liked the tweet
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)  # tweet that was liked
    timestamp = models.DateTimeField(auto_now_add=True) # time the tweet was liked

# Create your models here.
class Tweet(models.Model):
    # id = models.AutoField(primary_key=True)
    parent = models.ForeignKey("self", null=True, on_delete=models.SET_NULL) # if the parent tweet is deleted we set this to null
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # a user can have many tweets
    likes = models.ManyToManyField(User, related_name="tweet_user", blank=True, through=TweetLike)
    content = models.TextField(blank=True, null=True)
    image = models.FileField(upload_to="images/", blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.content)
    class Meta:
        ordering = ['-id']

    @property
    def is_retweet(self):
        return self.parent != None # if parent is not null then it is a retweet