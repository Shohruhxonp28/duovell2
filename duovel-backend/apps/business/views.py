from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import BusinessOwner
from .serializers import BusinessCreateSerializer, BusinessPlaceStatusSerializer
from apps.places.models import Place
from apps.categories.models import Category

class BusinessCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BusinessCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            category = Category.objects.get(id=data['category_id'])
        except Category.DoesNotExist:
            return Response({'error': 'Invalid category_id'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve or create BusinessOwner for user
        owner, _ = BusinessOwner.objects.get_or_create(
            user=request.user,
            defaults={
                'company_name': data['company_name'],
                'phone': data['company_phone']
            }
        )

        place = Place.objects.create(
            owner=owner,
            category=category,
            name=data['name'],
            description=data.get('description', ''),
            address=data['address'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            phone=data.get('phone', ''),
            website=data.get('website', ''),
            working_hours=data.get('working_hours', {}),
            status='PENDING'  # Admin must approve before public
        )

        return Response(
            {
                'message': 'Business place submitted successfully. Pending admin approval.',
                'place': BusinessPlaceStatusSerializer(place).data
            },
            status=status.HTTP_201_CREATED
        )


class MyBusinessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        places = Place.objects.filter(owner__user=request.user).select_related('category')
        serializer = BusinessPlaceStatusSerializer(places, many=True)
        return Response(serializer.data)
