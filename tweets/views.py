from django.shortcuts import render
from django.http import Http404, HttpResponse, JsonResponse
from .models import Tweet
import random
from .forms import TweetForm


# Create your views here.
def home_view(request, *args,**kwargs):
    return render(request, "tweets/home.html")

# view that creates tweets
def tweet_create_view(request, *args, **kwargs):
    form = TweetForm(request.POST or None) #TweetForm class can be initialized with data or not
    print("post data is: ", request.POST)
    if form.is_valid():
        obj = form.save(commit=False)
        # do other form related logic
        obj.save()
        form = TweetForm() #re-initialize a new blank form
    return render(request, "tweets/components/tweet_create_form.html", context={"Form": form})

def tweets_list_view(request, *args,**kwargs):
    querysets = Tweet.objects.all()
    tweets_list = [{"id": x.id, "content": x.content, "likes":random.randint(0, 256)} for x in querysets]
    data = {
        "isUser": False,
        "response": tweets_list
    }
    return JsonResponse(data)


def tweet_detail_view(request,tweet_id ,*args,**kwargs):
    """
    REST API VIEW
    API endpoints that can be consumed by javascript or Swift/Java/iOs/Android 
    return json data
    """

    data = {
        "id": tweet_id,
    }
    status = 200

    try:
        obj = Tweet.objects.get(id=tweet_id)
        data["content"] = obj.content
    except:
        data["message"] = "Not found"
        status = 404

    return JsonResponse(data, status= status)



# def home_view(request, *args,**kwargs):
#     print(args,kwargs)
#     return HttpResponse("<h1>Hello World</h1>")


# def tweet_detail_view(request,tweet_id ,*args,**kwargs):
#     print(args,kwargs)
#     return HttpResponse(f"<h1>Hello {tweet_id}</h1>")


# def tweet_detail_view(request,tweet_id ,*args,**kwargs):
#     try:
#         obj = Tweet.objects.get(id=tweet_id)
#     except:
#         raise Http404
#     return HttpResponse(f"<h1>{tweet_id} - {obj.content}</h1>")


# def tweet_detail_view(request,tweet_id ,*args,**kwargs):
#     """
#     REST API VIEW
#     return json data
#     """
#     obj = Tweet.objects.get(id=tweet_id)

#     data = {
#         "id": tweet_id,
#         "content": obj.content,
#         # "image_path": obj.image.url,
#     }
#     return JsonResponse(data)


# def tweet_detail_view(request,tweet_id ,*args,**kwargs):

#     data = {
#         "id": tweet_id,
#     }
#     status = 200

#     try:
#         obj = Tweet.objects.get(id=tweet_id)
#         data["content"] = obj.content
#     except:
#         data["message"] = "Not found"
#         status = 404

#     return JsonResponse(data, status= status)