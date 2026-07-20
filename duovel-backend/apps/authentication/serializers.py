from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'telegram_id', 'first_name', 'last_name', 
            'username', 'phone', 'language', 'latitude', 'longitude'
        ]
        read_only_fields = ['id', 'telegram_id']


class TelegramAuthSerializer(serializers.Serializer):
    initData = serializers.CharField(required=True)


class LocationUpdateSerializer(serializers.Serializer):
    latitude = serializers.FloatField(required=True)
    longitude = serializers.FloatField(required=True)
