from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root_view(request):
    return JsonResponse({
        "name": "Duovel REST API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "auth": "/api/auth/telegram/",
            "categories": "/api/categories/",
            "places": "/api/places/",
            "search": "/api/search/",
            "business": "/api/business/my/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root_view, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/categories/', include('apps.categories.urls')),
    path('api/', include('apps.places.urls')),
    path('api/business/', include('apps.business.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
