from django.contrib import admin
from django.utils.html import format_html
from apps.authentication.models import User
from apps.categories.models import Category
from apps.business.models import BusinessOwner
from apps.places.models import Place, PlaceImage, SavedPlace, SearchHistory

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('telegram_id', 'first_name', 'last_name', 'username', 'phone', 'is_staff', 'date_joined')
    search_fields = ('telegram_id', 'first_name', 'username', 'phone')
    list_filter = ('is_staff', 'is_active', 'date_joined')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'slug')


@admin.register(BusinessOwner)
class BusinessOwnerAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'user', 'phone', 'verified', 'created_at')
    list_filter = ('verified', 'created_at')
    search_fields = ('company_name', 'user__first_name', 'phone')


class PlaceImageInline(admin.TabularInline):
    model = PlaceImage
    extra = 1


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'owner', 'address', 'status_badge', 'rating', 'created_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('name', 'description', 'address')
    inlines = [PlaceImageInline]
    actions = ['approve_places', 'reject_places']

    @admin.display(description='Status')
    def status_badge(self, obj):
        colors = {
            'APPROVED': '#10B981',
            'PENDING': '#F59E0B',
            'REJECTED': '#EF4444'
        }
        color = colors.get(obj.status, '#6B7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )

    @admin.action(description='Approve selected places')
    def approve_places(self, request, queryset):
        updated = queryset.update(status='APPROVED')
        self.message_user(request, f"Successfully approved {updated} place(s).")

    @admin.action(description='Reject selected places')
    def reject_places(self, request, queryset):
        updated = queryset.update(status='REJECTED')
        self.message_user(request, f"Successfully rejected {updated} place(s).")


@admin.register(SavedPlace)
class SavedPlaceAdmin(admin.ModelAdmin):
    list_display = ('user', 'place', 'created_at')
    list_filter = ('created_at',)


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'query', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('query', 'user__first_name')
