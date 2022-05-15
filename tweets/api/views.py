from django.shortcuts import render, redirect
from django.http import Http404, HttpResponse, JsonResponse, HttpResponseRedirect
from django.conf import settings

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from ..serializers import TweetCreateSerializer, TweetSerializer, TweetActionSerializer
from ..models import Tweet
from ..forms import TweetForm
from django.db.models import Q


# tweet create view based on serializers
@api_view(['POST'])
# @authentication_classes([SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated]) # if they are authenticated they'll have access to this view otherwise they won't
def tweet_create_view(request, *args, **kwargs):
    serializer = TweetCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# tweet_list_view based on serializers
@api_view(['GET'])
def tweets_list_view(request, *args, **kwargs):
    queryset = Tweet.objects.all()
    username = request.GET.get("username") # ?username=mark
    if username != None:
        queryset = queryset.filter(user__username__iexact=username)
    serializer = TweetSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# tweet_feed_view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tweets_feed_view(request, *args, **kwargs):
    user = request.user
    profiles_exists = user.following.exists()
    followed_users_ids = []
    if profiles_exists:
        followed_users_ids = user.following.values_list("user__id", flat=True)
    queryset = Tweet.objects.filter(Q(user__id__in=followed_users_ids) | Q(user = user)).distinct().order_by("-timestamp")
    serializer = TweetSerializer(queryset, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# tweet_detail_view based on serializers
@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    queryset = Tweet.objects.filter(id=tweet_id)
    if not queryset.exists():
        return Response({"detail":f"Tweet with id {tweet_id} was not found"}, status=status.HTTP_404_NOT_FOUND)
    obj = queryset.first()
    serializer = TweetSerializer(obj)
    return Response(serializer.data, status=status.HTTP_200_OK)

# delete tweet API View
@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated]) 
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    queryset = Tweet.objects.filter(id=tweet_id)
    if not queryset.exists():
        return Response({"detail":f"Tweet with id {tweet_id} was not found"}, status=status.HTTP_404_NOT_FOUND)
    qs = queryset.filter(user=request.user)
    if not qs.exists():
        return Response({"detail":f"Not authorized to perform requested action"}, status=status.HTTP_401_UNAUTHORIZED)
    obj = queryset.first()
    obj.delete()
    return Response({"detail":f"Tweet with id {tweet_id} has been deleted"}, status=status.HTTP_204_NO_CONTENT)

# Handling the view logic on likes
@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def tweet_action_view(request, *args, **kwargs):
    '''
    id is required
    Action options are: like, unlike, retweet
    '''
    print(request.POST, request.data)
    serializer = TweetActionSerializer(data=request.data) # there is POST data
    if serializer.is_valid(raise_exception=True):
        data = serializer.validated_data
        tweet_id = data.get("id")
        action = data.get("action")
        content = data.get("content")

        queryset = Tweet.objects.filter(id=tweet_id)
        if not queryset.exists():
            return Response({"detail":f"Tweet with id {tweet_id} was not found"}, status=status.HTTP_404_NOT_FOUND)
        obj = queryset.first()

        if action == "like":
            obj.likes.add(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif action == "unlike":
            obj.likes.remove(request.user)
            serializer = TweetSerializer(obj)
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif action == "retweet":
            new_tweet = Tweet.objects.create(user=request.user, parent=obj, content=content)
            serializer = TweetSerializer(new_tweet)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response({}, status=200)




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
    return render(request, "tweets/components/tweet_create_form.html", context={"form": form})

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