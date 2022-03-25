from django.shortcuts import render, redirect
from django.http import Http404, HttpResponse, JsonResponse, HttpResponseRedirect
from django.conf import settings

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .serializers import TweetSerializer
from .models import Tweet
from .forms import TweetForm


# Create your views here.
def home_view(request, *args,**kwargs):
    return render(request, "tweets/home.html")


# tweet create view based on serializers
@api_view(['POST'])
@authentication_classes([SessionAuthentication])
@permission_classes([IsAuthenticated]) # if they are authenticated they'll have access to this view otherwise they won't
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetSerializer(data=request.POST)
    if serializer.is_valid(raise_exception=True):
        obj = serializer.save(user=request.user)
        print(obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# tweet_list_view based on serializers
@api_view(['GET'])
def tweets_list_view(request, *args, **kwargs):
    queryset = Tweet.objects.all()
    serializer = TweetSerializer(queryset, many=True)
    return Response(serializer.data)


# tweet_detail_view based on serializers
@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    queryset = Tweet.objects.filter(id=tweet_id)
    if not queryset.exists():
        return Response({"detail":f"Tweet with id {tweet_id} was not found"}, status=status.HTTP_404_NOT_FOUND,)
    obj = queryset.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data)



# Views based on pure django
# view that creates tweets based on forms
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

# view that lists tweets based on the serialize method in models
def tweets_list_view_pure_django(request, *args,**kwargs):
    querysets = Tweet.objects.all()
    tweets_list = [x.serialize() for x in querysets]
    data = {
        "isUser": False,
        "response": tweets_list
    }
    return JsonResponse(data)

# tweet detail view
def tweet_detail_view_pure_django(request,tweet_id ,*args,**kwargs):
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