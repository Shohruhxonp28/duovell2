import axios from 'axios';
import { Category, Place, PlaceFilterOptions, BusinessRegistrationForm, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '' : 'http://127.0.0.1:8000');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('duovel_auth_token', token);
    }
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('duovel_auth_token');
    }
  }
};

// Initialize stored token on startup
if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem('duovel_auth_token');
  if (storedToken) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
  }
}

export const authApi = {
  loginTelegram: async (initData: string): Promise<{ token: string; user: User }> => {
    const response = await apiClient.post('/api/auth/telegram/', { initData });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/api/auth/me/');
    return response.data;
  },
  updateLocation: async (latitude: number, longitude: number): Promise<User> => {
    const response = await apiClient.post('/api/auth/location/', { latitude, longitude });
    return response.data;
  }
};

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/api/categories/');
    return response.data;
  }
};

export const placesApi = {
  getPlaces: async (filters: PlaceFilterOptions = {}, lat?: number, lng?: number): Promise<Place[]> => {
    const params: Record<string, any> = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.radius) params.radius = filters.radius;
    if (filters.min_rating) params.min_rating = filters.min_rating;
    if (filters.open_now) params.open_now = 'true';
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (lat !== undefined) params.lat = lat;
    if (lng !== undefined) params.lng = lng;

    const response = await apiClient.get('/api/places/', { params });
    return response.data;
  },
  getPlaceDetail: async (id: number, lat?: number, lng?: number): Promise<Place> => {
    const params: Record<string, any> = {};
    if (lat !== undefined) params.lat = lat;
    if (lng !== undefined) params.lng = lng;

    const response = await apiClient.get(`/api/places/${id}/`, { params });
    return response.data;
  },
  getSavedPlaces: async (lat?: number, lng?: number): Promise<Place[]> => {
    const params: Record<string, any> = {};
    if (lat !== undefined) params.lat = lat;
    if (lng !== undefined) params.lng = lng;

    const response = await apiClient.get('/api/places/saved/', { params });
    return response.data;
  },
  toggleSavePlace: async (id: number): Promise<{ is_saved: boolean; message: string }> => {
    const response = await apiClient.post(`/api/places/${id}/save/`);
    return response.data;
  },
  search: async (query: string, category?: string, lat?: number, lng?: number): Promise<{ query: string; count: number; results: Place[] }> => {
    const params: Record<string, any> = { q: query };
    if (category) params.category = category;
    if (lat !== undefined) params.lat = lat;
    if (lng !== undefined) params.lng = lng;

    const response = await apiClient.get('/api/search/', { params });
    return response.data;
  }
};

export const businessApi = {
  createBusiness: async (data: BusinessRegistrationForm): Promise<{ message: string; place: any }> => {
    const response = await apiClient.post('/api/business/create/', data);
    return response.data;
  },
  getMyBusinesses: async (): Promise<any[]> => {
    const response = await apiClient.get('/api/business/my/');
    return response.data;
  }
};
