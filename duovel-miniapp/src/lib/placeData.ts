import { Review } from '@/types';

export const PLACE_IMAGES_MAP: Record<string, string> = {
  'XON Restaurant & Hotel': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
  'Kafe Afruza': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
  'Play Game Club': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
  'VIP Bilyard Club': 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=1000&q=80',
  'Shifoxona Medion Clinic': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
  'Chorsu Bozori & Do\'konlar': 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1000&q=80',
  'Ecopark Bog\'i': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=1000&q=80',
  'Milliy Bank va 24/7 Bankamat': 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1000&q=80',
  'City Taxi Toshkent': 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1000&q=80',
};

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'taksi': 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
  'restoran-kafe': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'mehmonxona': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  'game-club': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
  'shifoxona': 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
  'bozor-dokon': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
  'bog-parklar': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80',
  'bank-bankamat': 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_REVIEWS: Record<number | string, Review[]> = {
  default: [
    {
      id: 'rev-1',
      user_name: 'Jasur Bek',
      avatar_emoji: '😃',
      rating: 5,
      comment: 'Xizmat ko\'rsatish a\'lo darajada! Xodimlar juda xushmuomala, taomlar va muhit 10/10.',
      date: 'Bugun, 14:20'
    },
    {
      id: 'rev-2',
      user_name: 'Nilufar M.',
      avatar_emoji: '😊',
      rating: 5,
      comment: 'Juda shinam va toza maskan. Oilaviy tashrif buyurish uchun ajoyib tanlov!',
      date: 'Kecha, 19:45'
    },
    {
      id: 'rev-3',
      user_name: 'Bobur Aliyev',
      avatar_emoji: '👍',
      rating: 4,
      comment: 'Narxlar qulay, avtoturargoh mavjud. Manzilni topish oson bo\'ldi.',
      date: '2 kun oldin'
    }
  ]
};

export function getPlaceImage(placeName: string, categorySlug?: string, primaryImage?: string): string {
  if (primaryImage) return primaryImage;
  if (PLACE_IMAGES_MAP[placeName]) return PLACE_IMAGES_MAP[placeName];
  if (categorySlug && CATEGORY_FALLBACK_IMAGES[categorySlug]) return CATEGORY_FALLBACK_IMAGES[categorySlug];
  return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
}

