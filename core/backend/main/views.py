from django.shortcuts import redirect, render

# Create your views here.
def home(request):
    return redirect("quiz-list")