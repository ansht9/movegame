from django.urls import path
from .views import QuestionListAPIView, QuestionDetailAPIView, ExecuteCodeAPIView,SubmitQuestionAPIView,SubmitTestCaseAPIView

urlpatterns = [
    path('api/questions/', QuestionListAPIView.as_view(), name='q-list'),
    path('api/questions/<str:code>/', QuestionDetailAPIView.as_view(), name='q-detail'),
    path('api/run/', ExecuteCodeAPIView.as_view(), name='run'),
    path('api/submit/', SubmitQuestionAPIView.as_view(), name='submit'),
    path('api/submittest',SubmitTestCaseAPIView.as_view(), name='submittest')
]