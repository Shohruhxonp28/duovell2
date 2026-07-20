from rest_framework import serializers
from .models import BusinessOwner
from apps.places.models import Place, PlaceImage
from apps.categories.models import Category

class BusinessCreateSerializer(serializers.Serializer):
    company_name = serializers.CharField(max_length=200)
    company_phone = serializers.CharField(max_length=30)
    category_id = serializers.IntegerField()
    name = serializers.CharField(max_length=200)
    description = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(max_length=300)
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    phone = serializers.CharField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    working_hours = serializers.JSONField(required=False, default=dict)
    image_urls = serializers.ListField(child=serializers.URLField(), required=False, default=list)


class BusinessPlaceStatusSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Place
        fields = [
            'id', 'name', 'category_name', 'address', 
            'latitude', 'longitude', 'status', 'created_at'
        ]
