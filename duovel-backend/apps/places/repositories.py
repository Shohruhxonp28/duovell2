from django.db.models import Q
from .models import Place, SavedPlace, SearchHistory

class PlaceRepository:
    @staticmethod
    def get_approved_places():
        return Place.objects.filter(status='APPROVED').select_related('category', 'owner').prefetch_related('images')

    @staticmethod
    def get_place_by_id(place_id: int):
        return Place.objects.filter(id=place_id).select_related('category', 'owner').prefetch_related('images').first()

    @staticmethod
    def search_places(query: str = None, category_slug: str = None):
        qs = PlaceRepository.get_approved_places()
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if query:
            qs = qs.filter(
                Q(name__icontains=query) | 
                Q(description__icontains=query) | 
                Q(address__icontains=query) |
                Q(category__name__icontains=query)
            )
        return qs

    @staticmethod
    def get_saved_places_for_user(user):
        if not user or not user.is_authenticated:
            return Place.objects.none()
        saved_ids = SavedPlace.objects.filter(user=user).values_list('place_id', flat=True)
        return PlaceRepository.get_approved_places().filter(id__in=saved_ids)

    @staticmethod
    def is_saved(user, place_id: int) -> bool:
        if not user or not user.is_authenticated:
            return False
        return SavedPlace.objects.filter(user=user, place_id=place_id).exists()

    @staticmethod
    def record_search(user, query: str):
        if user and user.is_authenticated and query and query.strip():
            SearchHistory.objects.create(user=user, query=query.strip())
