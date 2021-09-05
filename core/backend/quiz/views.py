import json

from django.contrib.auth.models import User
from core.backend import quiz
from django.http import request
from django.http.response import JsonResponse
from core.backend.quiz.models import Answer, QuizEnrolledUser, QuizUserAnswer, Quizzes
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


# Create your views here.
def quiz_new(request):
    return HttpResponse("Hello world")

def quiz_list(request):
    quizzes = Quizzes.objects.filter(is_active=True)
    for quiz in quizzes:
        print(quiz.image)
    context = {
        "quizzes":quizzes
    }
    return render(request,"quiz-list.html",context)

def quiz_detail(request,pk):
    quiz = get_object_or_404(Quizzes,pk=pk)
    context = {
        "quiz":quiz
    }
    return render(request,"quiz-detail.html",context)

@login_required(login_url="login")
def quiz_start(request,pk):
    quiz = get_object_or_404(Quizzes,pk=pk)
    user = request.user
    quiz_enrolled = QuizEnrolledUser.objects.create(quiz=quiz,user=user)

    context = {
        "quiz":quiz,
        "quiz_enrolled":quiz_enrolled
    }
    return render(request,"quiz-start.html",context)

def quiz_questions(request,pk):
    quiz = get_object_or_404(Quizzes,pk=pk)
    questions = quiz.questions.all()
    data = [{"quiz_id":quiz.id,"question_id":question.id,"number":index+1,"question":question.title,"options":[{"id":answer.id,"option":answer.answer_text} for answer in question.answer.all()],"answer":question.answer.filter(is_right=True).first().answer_text} for index,question in enumerate(questions)]
    return JsonResponse({"success":True,"questions":data})

@csrf_exempt
def save_answer(request):
    data = json.loads(request.body)
    answer_id = data.get("answer")
    quiz_enrolled_id = data.get("quizEnrolled")


    quiz_enrolled = get_object_or_404(QuizEnrolledUser,pk=quiz_enrolled_id)
    answer = get_object_or_404(Answer,pk=answer_id)
    quiz_answer,created =  QuizUserAnswer.objects.get_or_create(quiz=quiz_enrolled)
    quiz_answer.answer.add(answer)
    quiz_answer.save()

    print(answer,quiz_enrolled)
    return JsonResponse({"success":True})
