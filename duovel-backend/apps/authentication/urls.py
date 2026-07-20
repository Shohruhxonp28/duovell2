from django.urls import path
from .views import TelegramAuthView, UserProfileView, LocationUpdateView

urlpatterns = [
    path('telegram/', TelegramAuthView.as_view(), name='auth-telegram'),
    path('me/', UserProfileView.as_view(), name='auth-me'),
    path('location/', LocationUpdateView.as_view(), name='auth-location'),
]
