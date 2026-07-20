from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TelegramAuthSerializer, UserSerializer, LocationUpdateSerializer
from .models import User
from .authentication import generate_jwt_token
from core.utils.telegram_auth import verify_telegram_init_data

class TelegramAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = TelegramAuthSerializer(data=request.data)
        if not serializer.is_validate():
            pass # Use serializer.is_valid()
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        init_data = serializer.validated_data['initData']
        is_valid, telegram_user = verify_telegram_init_data(init_data)

        if not is_valid or not telegram_user or 'id' not in telegram_user:
            return Response(
                {'error': 'Invalid or unverified Telegram data'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        telegram_id = telegram_user['id']
        user, created = User.objects.get_or_create(
            telegram_id=telegram_id,
            defaults={
                'first_name': telegram_user.get('first_name', ''),
                'last_name': telegram_user.get('last_name'),
                'username': telegram_user.get('username'),
                'language': telegram_user.get('language_code', 'en')
            }
        )

        if not created:
            # Update info if changed
            user.first_name = telegram_user.get('first_name', user.first_name)
            user.last_name = telegram_user.get('last_name', user.last_name)
            user.username = telegram_user.get('username', user.username)
            user.save()

        token = generate_jwt_token(user)
        return Response({
            'token': token,
            'user': UserSerializer(user).data
        })


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LocationUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        request.user.latitude = serializer.validated_data['latitude']
        request.user.longitude = serializer.validated_data['longitude']
        request.user.save()

        return Response(UserSerializer(request.user).data)
