from django.contrib.auth import authenticate, login,logout
from core.backend.authentication.forms import LoginForm, NewUserCreationForm
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.models import User

# Create your views here.
def register(request):
    if request.user.is_authenticated:
        return redirect('/')
    else:
        if request.method == "POST":
            form = NewUserCreationForm(request.POST)
            if form.is_valid():
                username = form.cleaned_data.get('username')
                form.save()
                messages.info(
                    request, f"{username} Your Account Created Succesfully!")
                return redirect('login')
        
    form = NewUserCreationForm()
    context = {
        "form":form
    }
    return render(request,"register.html",context)

def mylogin(request):
    if request.user.is_authenticated:
        return redirect('/')
    else:
        form = LoginForm(request.POST or None)
        msg = None
        if request.method == "POST":
            if form.is_valid():
                email = form.cleaned_data.get("email")
                username = get_object_or_404(User,email=email).username
                password = form.cleaned_data.get("password")
                url = request.GET.get("next",None)
                print("url:   ",url)

                user = authenticate(request,username=username,password=password)

                if user is not None:
                    login(request,user)

                    return redirect(url) if url else redirect("quiz-list")
                else:
                    msg = 'Invalid credentials' 
            else:
                msg = 'Error validating the form'
        context = {
            "form":form,
            "msg":msg
        }
        return render(request,"login.html",context)

def mylogout(request):
    logout(request)
    return redirect("login")