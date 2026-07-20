from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    places_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'places_count']

    def get_places_count(self, obj):
        return obj.places.filter(status='APPROVED').count()
