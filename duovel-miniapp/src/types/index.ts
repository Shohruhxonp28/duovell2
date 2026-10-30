export interface User {
  id: number;
  telegram_id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  phone?: string;
  language: string;
  latitude?: number;
  longitude?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  places_count?: number;
}

export interface Review {
  id: string;
  user_name: string;
  avatar_emoji?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Place {
  id: number;
  name: string;
  category?: Category;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website?: string;
  working_hours?: Record<string, string>;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rating: number;
  distance: number;
  is_open: boolean;
  is_saved: boolean;
  primary_image?: string;
  images?: string[];
  reviews?: Review[];
  google_maps_url?: string;
  yandex_maps_url?: string;
}

export interface PlaceFilterOptions {
  category?: string;
  search?: string;
  radius?: number;
  min_rating?: number;
  open_now?: boolean;
  sort_by?: 'distance' | 'rating' | 'newest';
}

export interface BusinessRegistrationForm {
  company_name: string;
  company_phone: string;
  category_id: number;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  working_hours: Record<string, string>;
}

export interface BookingOrder {
  id: string;
  place_id: number;
  place_name: string;
  category_name: string;
  date: string;
  time: string;
  guests_count?: number;
  phone: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}
