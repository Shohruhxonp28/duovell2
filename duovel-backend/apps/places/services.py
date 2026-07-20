from core.utils.distance import haversine_distance, is_place_open_now
from .repositories import PlaceRepository

class PlaceService:
    @staticmethod
    def get_filtered_places(
        user_lat: float = None,
        user_lng: float = None,
        category_slug: str = None,
        search_query: str = None,
        max_distance: float = None,
        min_rating: float = None,
        open_now: bool = False,
        sort_by: str = 'distance'  # 'distance', 'rating', 'newest'
    ):
        qs = PlaceRepository.search_places(query=search_query, category_slug=category_slug)
        places_list = list(qs)

        processed_places = []
        for place in places_list:
            distance_km = 0.0
            if user_lat is not None and user_lng is not None:
                distance_km = haversine_distance(user_lat, user_lng, place.latitude, place.longitude)

            is_open = is_place_open_now(place.working_hours)

            # Filter max_distance
            if max_distance is not None and user_lat is not None and user_lng is not None:
                if distance_km > max_distance:
                    continue

            # Filter min_rating
            if min_rating is not None and place.rating < min_rating:
                continue

            # Filter open_now
            if open_now and not is_open:
                continue

            place.computed_distance = distance_km
            place.computed_is_open = is_open
            processed_places.append(place)

        # Sort results
        if sort_by == 'rating':
            processed_places.sort(key=lambda p: p.rating, reverse=True)
        elif sort_by == 'newest':
            processed_places.sort(key=lambda p: p.created_at, reverse=True)
        else: # default distance
            if user_lat is not None and user_lng is not None:
                processed_places.sort(key=lambda p: p.computed_distance)

        return processed_places
