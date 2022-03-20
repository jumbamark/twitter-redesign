from django import forms
from .models import Tweet

MAX_TWEET_LENGTH = 240

class TweetForm(forms.ModelForm):
    # meta class describes the entire form itself
    class Meta:
        model = Tweet
        fields = ['content']

    # validating content (under 240 characters)
    def clean_content(self):
        content = self.cleaned_data.get("content")
        if len(content) > MAX_TWEET_LENGTH:
            raise forms.ValidationError("This tweet is too long")
        return content


