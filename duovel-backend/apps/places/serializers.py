from rest_framework import serializers
from .models import Place, PlaceImage, SavedPlace, SearchHistory
from apps.categories.serializers import CategorySerializer

class PlaceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlaceImage
        fields = ['id', 'image']


class PlaceListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    distance = serializers.SerializerMethodField()
    is_open = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            'id', 'name', 'category', 'description', 'address', 
            'latitude', 'longitude', 'phone', 'rating', 'status',
            'distance', 'is_open', 'is_saved', 'primary_image'
        ]

    def get_distance(self, obj):
        return getattr(obj, 'computed_distance', 0.0)

    def get_is_open(self, obj):
        return getattr(obj, 'computed_is_open', True)

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return SavedPlace.objects.filter(user=request.user, place=obj).exists()
        return False

    def get_primary_image(self, obj):
        first_img = obj.images.first()
        if first_img and first_img.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_img.image.url)
            return first_img.image.url
        return None


class PlaceDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = serializers.SerializerMethodField()
    distance = serializers.SerializerMethodField()
    is_open = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    google_maps_url = serializers.SerializerMethodField()
    yandex_maps_url = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            'id', 'name', 'category', 'description', 'address',
            'latitude', 'longitude', 'phone', 'website', 'working_hours',
            'status', 'rating', 'created_at', 'images', 'distance',
            'is_open', 'is_saved', 'google_maps_url', 'yandex_maps_url'
        ]

    def get_images(self, obj):
        request = self.context.get('request')
        urls = []
        for img in obj.images.all():
            if img.image:
                urls.append(request.build_absolute_uri(img.image.url) if request else img.image.url)
        return urls

    def get_distance(self, obj):
        return getattr(obj, 'computed_distance', 0.0)

    def get_is_open(self, obj):
        return getattr(obj, 'computed_is_open', True)

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return SavedPlace.objects.filter(user=request.user, place=obj).exists()
        return False

    def get_google_maps_url(self, obj):
        return f"https://www.google.com/maps/dir/?api=1&destination={obj.latitude},{obj.longitude}"

    def get_yandex_maps_url(self, obj):
        return f"https://yandex.com/maps/?rtext=~{obj.latitude},{obj.longitude}"


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ['id', 'query', 'created_at']
