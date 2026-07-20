from django.urls import path
from .views import (
    PlaceListView, PlaceDetailView, SearchView, 
    SavedPlacesView, ToggleSavedPlaceView, SearchHistoryView
)

urlpatterns = [
    path('places/', PlaceListView.as_view(), name='place-list'),
    path('places/<int:pk>/', PlaceDetailView.as_view(), name='place-detail'),
    path('places/saved/', SavedPlacesView.as_view(), name='saved-places'),
    path('places/<int:pk>/save/', ToggleSavedPlaceView.as_view(), name='toggle-save-place'),
    path('search/', SearchView.as_view(), name='place-search'),
    path('search/history/', SearchHistoryView.as_view(), name='search-history'),
]
