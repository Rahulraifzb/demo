from django.urls import path
from django.urls.conf import include
from . import views

urlpatterns = [
    path("quiz-new/",views.quiz_new,name="quiz-new"),
    path("quiz-list/",views.quiz_list,name="quiz-list"),
    path("quiz-detail/<str:pk>/",views.quiz_detail,name="quiz-detail"),
    path("quiz-start/<str:pk>/",views.quiz_start,name="quiz-start"),
    path("quiz-questions/<str:pk>/",views.quiz_questions,name="quiz-questions"),
    path("save-answer/",views.save_answer,name="save-answer"),
]
