from django.core.management.base import BaseCommand
from apps.categories.models import Category
from apps.places.models import Place

class Command(BaseCommand):
    help = 'Seeds initial categories and sample places'

    def handle(self, *args, **options):
        self.stdout.write("Seeding categories...")

        categories_data = [
            {'name': 'Taksi', 'slug': 'taksi', 'icon': 'Car'},
            {'name': 'Restoran va Kafe', 'slug': 'restoran-kafe', 'icon': 'Utensils'},
            {'name': 'Mehmonxona', 'slug': 'mehmonxona', 'icon': 'Hotel'},
            {'name': 'Game club', 'slug': 'game-club', 'icon': 'Gamepad2'},
            {'name': 'Shifoxona', 'slug': 'shifoxona', 'icon': 'Stethoscope'},
            {'name': 'Bozor va do\'kon', 'slug': 'bozor-dokon', 'icon': 'ShoppingBag'},
            {'name': 'Bog\' va Parklar', 'slug': 'bog-parklar', 'icon': 'Trees'},
            {'name': 'Bank va Bankamat', 'slug': 'bank-bankamat', 'icon': 'CreditCard'},
        ]

        cat_objs = {}
        for cat in categories_data:
            obj, created = Category.objects.update_or_create(
                slug=cat['slug'],
                defaults={'name': cat['name'], 'icon': cat['icon']}
            )
            cat_objs[cat['slug']] = obj

        self.stdout.write(self.style.SUCCESS(f"Created {len(cat_objs)} categories."))

        self.stdout.write("Seeding sample places...")

        sample_places = [
            {
                'name': 'XON Restaurant & Hotel',
                'category': cat_objs['restoran-kafe'],
                'description': 'Hashamatli XON restorani va 24/7 qulay mehmonxona majmuasi. Milliy va yevropa taomlari, shinam xonalar va a\'lo darajadagi servis.',
                'address': 'Toshkent sh., Amir Temur shox ko\'chasi, 45-uy',
                'latitude': 41.311081,
                'longitude': 69.240562,
                'phone': '+998 91 234 56 78',
                'website': 'https://xon-complex.uz',
                'working_hours': {'restaurant': '11:00 - 00:00', 'hotel': '24/7', 'mon': '11:00-00:00', 'all': '24/7'},
                'rating': 4.9,
                'status': 'APPROVED'
            },
            {
                'name': 'Kafe Afruza',
                'category': cat_objs['restoran-kafe'],
                'description': 'Shinam muhit, maxsus kofe, mazali desertlar va qulay ish joyi. Do\'stlar bilan uchrashuvlar uchun eng yaxshi maskan.',
                'address': 'Toshkent sh., Mirobod tumani, Afrosiyob ko\'chasi, 12',
                'latitude': 41.299496,
                'longitude': 69.263884,
                'phone': '+998 90 123 45 67',
                'website': 'https://afruza-cafe.uz',
                'working_hours': {'mon': '11:00 - 00:00', 'all': '11:00 - 00:00'},
                'rating': 4.8,
                'status': 'APPROVED'
            },
            {
                'name': 'Play Game Club',
                'category': cat_objs['game-club'],
                'description': 'Eng so\'nggi RTX 4080 videokartali kuchli kompyuterlar, PS5 zallari, VIP xonalar va kibersport turnirlari.',
                'address': 'Toshkent sh., Navoiy ko\'chasi, 28-uy',
                'latitude': 41.320450,
                'longitude': 69.245890,
                'phone': '+998 93 456 78 90',
                'website': 'https://playclub.uz',
                'working_hours': {'mon': '10:00 - 23:00', 'all': '10:00 - 23:00'},
                'rating': 4.7,
                'status': 'APPROVED'
            },
            {
                'name': 'VIP Bilyard Club',
                'category': cat_objs['game-club'],
                'description': 'Professional bilyard stollari, shinam VIP zallar, kofe va yaxna ichimliklar. Do\'stona muhit.',
                'address': 'Toshkent sh., Mustaqillik shoh ko\'chasi, 15',
                'latitude': 41.315600,
                'longitude': 69.281200,
                'phone': '+998 94 567 89 01',
                'website': '',
                'working_hours': {'mon': '11:00 - 01:00', 'all': '11:00 - 01:00'},
                'rating': 4.6,
                'status': 'APPROVED'
            },
            {
                'name': 'Shifoxona Medion Clinic',
                'category': cat_objs['shifoxona'],
                'description': 'Zamonaviy tibbiy diagnostika markazi, laboratoriya, tajribali shifokorlar va 24/7 tez tibbiy yordam.',
                'address': 'Toshkent sh., Shayxontohur tumani, Zulfiyaxonim ko\'chasi, 18',
                'latitude': 41.325600,
                'longitude': 69.255400,
                'phone': '+998 71 200 00 03',
                'website': 'https://medion.uz',
                'working_hours': {'mon': '24/7', 'all': '24/7'},
                'rating': 4.9,
                'status': 'APPROVED'
            },
            {
                'name': 'Chorsu Bozori & Do\'konlar',
                'category': cat_objs['bozor-dokon'],
                'description': 'Sharqona mashhur bozor, yangi meva-sabzavotlar, qandolatlar, suvenirlar va zamonaviy savdo do\'konlari.',
                'address': 'Toshkent sh., Navoiy va Beruniy chorrahasi',
                'latitude': 41.327500,
                'longitude': 69.235600,
                'phone': '+998 71 242 12 34',
                'website': '',
                'working_hours': {'mon': '08:00 - 19:00', 'all': '08:00 - 19:00'},
                'rating': 4.7,
                'status': 'APPROVED'
            },
            {
                'name': 'Ecopark Bog\'i',
                'category': cat_objs['bog-parklar'],
                'description': 'Sayr qilish, yugurish, bolalar maydonchasi va dam olish uchun shahar markazidagi yashil bog\'.',
                'address': 'Toshkent sh., Mirzo Ulug\'bek tumani, Oqqo\'rg\'on ko\'chasi',
                'latitude': 41.318800,
                'longitude': 69.296500,
                'phone': '+998 71 267 89 00',
                'website': '',
                'working_hours': {'mon': '06:00 - 23:00', 'all': '06:00 - 23:00'},
                'rating': 4.8,
                'status': 'APPROVED'
            },
            {
                'name': 'Milliy Bank va 24/7 Bankamat',
                'category': cat_objs['bank-bankamat'],
                'description': '24/7 valyuta ayirboshlash bankomatlari, Humo, Uzcard, Visa, Mastercard xizmatlari va kredit bo\'limi.',
                'address': 'Toshkent sh., Amir Temur shox ko\'chasi, 101',
                'latitude': 41.328900,
                'longitude': 69.284200,
                'phone': '+998 71 148 00 10',
                'website': 'https://nbu.uz',
                'working_hours': {'mon': '24/7', 'all': '24/7'},
                'rating': 4.5,
                'status': 'APPROVED'
            },
            {
                'name': 'City Taxi Toshkent',
                'category': cat_objs['taksi'],
                'description': 'Shahar bo\'ylab tezkor va qulay taksi xizmati. Ekonom, Komfort va Biznes tariflari.',
                'address': 'Toshkent sh., Shota Rustaveli ko\'chasi, 53',
                'latitude': 41.285400,
                'longitude': 69.248900,
                'phone': '+998 71 200 55 55',
                'website': '',
                'working_hours': {'mon': '24/7', 'all': '24/7'},
                'rating': 4.8,
                'status': 'APPROVED'
            }
        ]

        for p_data in sample_places:
            Place.objects.update_or_create(
                name=p_data['name'],
                defaults=p_data
            )

        self.stdout.write(self.style.SUCCESS("Successfully seeded sample places!"))
