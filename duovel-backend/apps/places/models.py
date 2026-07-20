from django.db import models
from django.conf import settings
from apps.categories.models import Category
from apps.business.models import BusinessOwner

class Place(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    owner = models.ForeignKey(
        BusinessOwner, 
        on_delete=models.CASCADE, 
        related_name='places', 
        null=True, 
        blank=True
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='places'
    )
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=300)
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    working_hours = models.JSONField(
        default=dict, 
        blank=True,
        help_text="Format e.g. {'mon': '09:00-21:00', 'all': '24/7'}"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPROVED', db_index=True)
    rating = models.FloatField(default=4.5)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"


class PlaceImage(models.Model):
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='places/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.place.name}"


class SavedPlace(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_places')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, related_name='saved_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'place')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} saved {self.place.name}"


class SearchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='search_history')
    query = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user}: {self.query}"
