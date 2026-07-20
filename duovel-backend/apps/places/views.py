from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from core.utils.distance import haversine_distance, is_place_open_now
from .repositories import PlaceRepository
from .services import PlaceService
from .serializers import PlaceListSerializer, PlaceDetailSerializer, SearchHistorySerializer
from .models import Place, SavedPlace, SearchHistory

class PlaceListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category_slug = request.query_params.get('category')
        search_query = request.query_params.get('search')
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius = request.query_params.get('radius')
        min_rating = request.query_params.get('min_rating')
        open_now = request.query_params.get('open_now', '').lower() == 'true'
        sort_by = request.query_params.get('sort_by', 'distance')

        user_lat = float(lat) if lat else (request.user.latitude if request.user and request.user.is_authenticated else None)
        user_lng = float(lng) if lng else (request.user.longitude if request.user and request.user.is_authenticated else None)
        max_dist = float(radius) if radius else None
        rating_filter = float(min_rating) if min_rating else None

        places = PlaceService.get_filtered_places(
            user_lat=user_lat,
            user_lng=user_lng,
            category_slug=category_slug,
            search_query=search_query,
            max_distance=max_dist,
            min_rating=rating_filter,
            open_now=open_now,
            sort_by=sort_by
        )

        serializer = PlaceListSerializer(places, many=True, context={'request': request})
        return Response(serializer.data)


class PlaceDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        place = PlaceRepository.get_place_by_id(pk)
        if not place:
            return Response({'error': 'Place not found'}, status=status.HTTP_404_NOT_FOUND)

        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        user_lat = float(lat) if lat else (request.user.latitude if request.user and request.user.is_authenticated else None)
        user_lng = float(lng) if lng else (request.user.longitude if request.user and request.user.is_authenticated else None)

        if user_lat is not None and user_lng is not None:
            place.computed_distance = haversine_distance(user_lat, user_lng, place.latitude, place.longitude)
        else:
            place.computed_distance = 0.0

        place.computed_is_open = is_place_open_now(place.working_hours)

        serializer = PlaceDetailSerializer(place, context={'request': request})
        return Response(serializer.data)


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        category_slug = request.query_params.get('category')
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')

        if query:
            PlaceRepository.record_search(request.user, query)

        user_lat = float(lat) if lat else (request.user.latitude if request.user and request.user.is_authenticated else None)
        user_lng = float(lng) if lng else (request.user.longitude if request.user and request.user.is_authenticated else None)

        places = PlaceService.get_filtered_places(
            user_lat=user_lat,
            user_lng=user_lng,
            category_slug=category_slug,
            search_query=query,
            sort_by='distance'
        )

        serializer = PlaceListSerializer(places, many=True, context={'request': request})
        return Response({
            'query': query,
            'count': len(places),
            'results': serializer.data
        })


class SavedPlacesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        saved_places = PlaceRepository.get_saved_places_for_user(request.user)
        lat = request.query_params.get('lat') or request.user.latitude
        lng = request.query_params.get('lng') or request.user.longitude

        places_list = list(saved_places)
        for p in places_list:
            p.computed_distance = haversine_distance(float(lat), float(lng), p.latitude, p.longitude) if lat and lng else 0.0
            p.computed_is_open = is_place_open_now(p.working_hours)

        serializer = PlaceListSerializer(places_list, many=True, context={'request': request})
        return Response(serializer.data)


class ToggleSavedPlaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        place = PlaceRepository.get_place_by_id(pk)
        if not place:
            return Response({'error': 'Place not found'}, status=status.HTTP_404_NOT_FOUND)

        saved, created = SavedPlace.objects.get_or_create(user=request.user, place=place)
        if not created:
            saved.delete()
            return Response({'is_saved': False, 'message': 'Removed from saved places'})
        
        return Response({'is_saved': True, 'message': 'Added to saved places'}, status=status.HTTP_201_CREATED)


class SearchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = SearchHistory.objects.filter(user=request.user)[:10]
        serializer = SearchHistorySerializer(history, many=True)
        return Response(serializer.data)
