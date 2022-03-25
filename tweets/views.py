from django.shortcuts import render, redirect
from django.http import Http404, HttpResponse, JsonResponse, HttpResponseRedirect
from django.conf import settings
from .models import Tweet
from .forms import TweetForm
from .serializers import TweetSerializer


# Create your views here.
def home_view(request, *args,**kwargs):
    return render(request, "tweets/home.html")

# tweet create view using the serializer
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetSerializer(data=request.POST or None)
    if serializer.is_valid():
        obj = serializer.save(user=request.user)
        print(obj)
        return JsonResponse(serializer.data, status=201)
    return JsonResponse({}, status=400)

# view that creates tweets
def tweet_create_view_pure_django(request, *args, **kwargs):
    '''
    REST API Create View
    '''
    
    user = request.user
    if not request.user.is_authenticated:
        user = None
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({}, status=401)
        return redirect(settings.LOGIN_URL)

    form = TweetForm(request.POST or None) #TweetForm class can be initialized with data or not
    print("post data is: ", request.POST)
    next_url = request.POST.get("next") or None
    print("next_url: ", next_url)
    if form.is_valid():
        obj = form.save(commit=False)
        # do other form related logic
        obj.user = user
        obj.save()

        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse(obj.serialize(), status=201) # 201 == creted items

        if next_url != None:
            return redirect(next_url)
        form = TweetForm() #re-initialize a new blank form
    if form.errors:
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse(form.errors, status=400)
    return render(request, "tweets/components/tweet_create_form.html", context={"Form": form})

def tweets_list_view(request, *args,**kwargs):
    querysets = Tweet.objects.all()
    tweets_list = [x.serialize() for x in querysets]
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