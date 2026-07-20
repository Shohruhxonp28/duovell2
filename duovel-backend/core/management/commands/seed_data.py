from django.core.management.base import BaseCommand
from apps.categories.models import Category
from apps.places.models import Place, PlaceImage

class Command(BaseCommand):
    help = 'Seeds initial categories and sample places'

    def handle(self, *args, **options):
        self.stdout.write("Seeding categories...")

        categories_data = [
            {'name': 'Restaurants', 'slug': 'restaurants', 'icon': 'Utensils'},
            {'name': 'Cafes', 'slug': 'cafes', 'icon': 'Coffee'},
            {'name': 'Clinics', 'slug': 'clinics', 'icon': 'Stethoscope'},
            {'name': 'Pharmacies', 'slug': 'pharmacies', 'icon': 'Pill'},
            {'name': 'Auto Services', 'slug': 'auto-services', 'icon': 'Car'},
            {'name': 'Beauty Salons', 'slug': 'beauty-salons', 'icon': 'Scissors'},
            {'name': 'Shopping Centers', 'slug': 'shopping-centers', 'icon': 'ShoppingBag'},
            {'name': 'Fitness Clubs', 'slug': 'fitness-clubs', 'icon': 'Dumbbell'},
            {'name': 'Hotels', 'slug': 'hotels', 'icon': 'Hotel'},
        ]

        cat_objs = {}
        for cat in categories_data:
            obj, created = Category.objects.get_or_create(
                slug=cat['slug'],
                defaults={'name': cat['name'], 'icon': cat['icon']}
            )
            cat_objs[cat['slug']] = obj

        self.stdout.write(self.style.SUCCESS(f"Created {len(cat_objs)} categories."))

        self.stdout.write("Seeding sample places...")

        sample_places = [
            {
                'name': 'Gourmet House Restaurant',
                'category': cat_objs['restaurants'],
                'description': 'Fine dining restaurant serving exquisite Mediterranean and European cuisine.',
                'address': 'Navoi Avenue 14, City Center',
                'latitude': 41.311081,
                'longitude': 69.240562,
                'phone': '+998 71 200 1122',
                'website': 'https://gourmethouse.example.com',
                'working_hours': {'all': '10:00-23:00'},
                'rating': 4.8,
                'status': 'APPROVED'
            },
            {
                'name': 'Artisan Coffee Roasters',
                'category': cat_objs['cafes'],
                'description': 'Specialty espresso, filter coffee, artisan pastries, and cozy atmosphere.',
                'address': 'Amir Temur Street 42',
                'latitude': 41.315500,
                'longitude': 69.278000,
                'phone': '+998 71 233 4455',
                'website': 'https://artisancoffee.example.com',
                'working_hours': {'all': '08:00-22:00'},
                'rating': 4.9,
                'status': 'APPROVED'
            },
            {
                'name': 'Central Medical Clinic',
                'category': cat_objs['clinics'],
                'description': 'Modern diagnostic clinic with multi-specialty doctors and laboratory.',
                'address': 'Sharof Rashidov Avenue 8',
                'latitude': 41.305000,
                'longitude': 69.260000,
                'phone': '+998 71 150 0099',
                'website': 'https://centralmed.example.com',
                'working_hours': {'mon': '08:00-20:00', 'sat': '09:00-15:00'},
                'rating': 4.7,
                'status': 'APPROVED'
            },
            {
                'name': '24/7 City Express Pharmacy',
                'category': cat_objs['pharmacies'],
                'description': 'Round the clock pharmacy offering rare medications and health care products.',
                'address': 'Mustaqillik Avenue 88',
                'latitude': 41.320000,
                'longitude': 69.290000,
                'phone': '+998 71 252 0000',
                'website': 'https://expresspharm.example.com',
                'working_hours': {'all': '24/7'},
                'rating': 4.6,
                'status': 'APPROVED'
            },
            {
                'name': 'Apex Auto Care & Diagnostics',
                'category': cat_objs['auto-services'],
                'description': 'Full service auto repair, tire alignment, detailing, and oil change.',
                'address': 'Little Ring Road 105',
                'latitude': 41.290000,
                'longitude': 69.220000,
                'phone': '+998 90 999 8877',
                'website': 'https://apexauto.example.com',
                'working_hours': {'all': '09:00-19:00'},
                'rating': 4.5,
                'status': 'APPROVED'
            },
            {
                'name': 'Glamour Beauty Studio',
                'category': cat_objs['beauty-salons'],
                'description': 'Hair styling, manicure, spa treatments, and professional makeup services.',
                'address': 'Oybek Street 22',
                'latitude': 41.298000,
                'longitude': 69.270000,
                'phone': '+998 71 256 7890',
                'website': 'https://glamourstudio.example.com',
                'working_hours': {'all': '10:00-20:00'},
                'rating': 4.8,
                'status': 'APPROVED'
            },
            {
                'name': 'Grand City Mall',
                'category': cat_objs['shopping-centers'],
                'description': 'Multi-level shopping center with international fashion brands, food court, and cinema.',
                'address': 'Sebzar Street 1',
                'latitude': 41.335000,
                'longitude': 69.255000,
                'phone': '+998 71 202 0202',
                'website': 'https://grandcitymall.example.com',
                'working_hours': {'all': '10:00-22:00'},
                'rating': 4.9,
                'status': 'APPROVED'
            },
            {
                'name': 'Pulse Elite Fitness & Spa',
                'category': cat_objs['fitness-clubs'],
                'description': 'Modern gym with Olympic pool, sauna, group fitness classes, and personal trainers.',
                'address': 'Nukus Street 50',
                'latitude': 41.293000,
                'longitude': 69.282000,
                'phone': '+998 71 280 5050',
                'website': 'https://pulsefitness.example.com',
                'working_hours': {'all': '07:00-23:00'},
                'rating': 4.8,
                'status': 'APPROVED'
            },
            {
                'name': 'Silk Road Palace Hotel',
                'category': cat_objs['hotels'],
                'description': 'Luxury 5-star hotel featuring rooftop restaurant, spa, and conference facilities.',
                'address': 'Islam Karimov Street 15',
                'latitude': 41.308000,
                'longitude': 69.268000,
                'phone': '+998 71 120 7000',
                'website': 'https://silkroadpalace.example.com',
                'working_hours': {'all': '24/7'},
                'rating': 4.9,
                'status': 'APPROVED'
            }
        ]

        for p_data in sample_places:
            Place.objects.get_or_create(
                name=p_data['name'],
                defaults=p_data
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded sample places!"))
