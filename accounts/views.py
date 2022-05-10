from django.shortcuts import redirect, render
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import login, logout, authenticate

# Create your views here.
def login_view(request, *args, **kwargs):
    form = MyModelForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        user_ = authenticate(username, password)
        login(request, user_)
        return redirect("/")
    return render(request, "form.html", {"Form": form})