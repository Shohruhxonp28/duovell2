from django.urls import path
from .views import BusinessCreateView, MyBusinessView

urlpatterns = [
    path('create/', BusinessCreateView.as_view(), name='business-create'),
    path('my/', MyBusinessView.as_view(), name='business-my'),
]
