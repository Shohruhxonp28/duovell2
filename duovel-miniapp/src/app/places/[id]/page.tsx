'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  MapPin, 
  Navigation, 
  Phone, 
  Globe, 
  Clock, 
  Bookmark, 
  ArrowLeft, 
  ExternalLink, 
  RefreshCw, 
  Send, 
  MessageSquare, 
  ChevronDown,
  Sparkles,
  Share2
} from 'lucide-react';
import { Place, Review } from '@/types';
import { placesApi } from '@/lib/api';
import { useLocation } from '@/context/LocationContext';
import { formatDistance, openGoogleMaps, openYandexMaps } from '@/lib/utils';
import { getPlaceImage, DEFAULT_REVIEWS } from '@/lib/placeData';
import { triggerHaptic } from '@/lib/telegram';
import { useTelegram } from '@/context/TelegramContext';

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const placeId = Number(params.id);
  const { latitude, longitude } = useLocation();
  const { user } = useTelegram();

  const [place, setPlace] = useState<Place | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (placeId) {
      placesApi.getPlaceDetail(placeId, latitude || undefined, longitude || undefined)
        .then((res) => {
          setPlace(res);
          setIsSaved(res.is_saved);
          // Set initial sample reviews
          const sample = DEFAULT_REVIEWS[placeId] || DEFAULT_REVIEWS.default;
          setReviews(sample);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [placeId, latitude, longitude]);

  const handleBookmarkToggle = async () => {
    if (!place) return;
    triggerHaptic('notification', 'success');
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    try {
      await placesApi.toggleSavePlace(place.id);
    } catch (e) {
      setIsSaved(!isSaved);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    triggerHaptic('impact', 'medium');
    setIsSubmittingReview(true);

    const userName = user?.first_name 
      ? `${user.first_name} ${user.last_name || ''}`.trim()
      : 'Siz (Foydalanuvchi)';

    const emojiChoices = ['😃', '😊', '😍', '👍'];
    const randomEmoji = emojiChoices[Math.floor(Math.random() * emojiChoices.length)];

    const createdReview: Review = {
      id: `rev-${Date.now()}`,
      user_name: userName,
      avatar_emoji: randomEmoji,
      rating: newRating,
      comment: newComment.trim(),
      date: 'Hozirgina'
    };

    setTimeout(() => {
      setReviews([createdReview, ...reviews]);
      setNewComment('');
      setIsSubmittingReview(false);
      triggerHaptic('notification', 'success');
    }, 200);
  };

  const handleShare = () => {
    triggerHaptic('selection');
    if (navigator.share && place) {
      navigator.share({
        title: place.name,
        text: `${place.name} - Duovel orqali topildi. Manzil: ${place.address}`,
        url: window.location.href,
      }).catch(() => {});
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-2 text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
        <span className="text-xs font-semibold">Tafsilotlar yuklanmoqda...</span>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-12 space-y-3">
        <h2 className="font-bold text-slate-900 dark:text-white text-base">Joy topilmadi</h2>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-xs"
        >
          Orqaga qaytish
        </button>
      </div>
    );
  }

  const imageUrl = getPlaceImage(place.name, place.category?.slug, place.primary_image);
  const hoursString = place.working_hours
    ? (place.working_hours.restaurant 
      ? place.working_hours.restaurant 
      : place.working_hours.mon || '11:00 / 00:00')
    : '11:00 / 00:00';

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Top Bar with Back, Share, and Bookmark */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            triggerHaptic('selection');
            router.back();
          }}
          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            aria-label="Ulashish"
          >
            <Share2 className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-all ${
              isSaved
                ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/50 dark:text-amber-400'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Place Header Card (Matches Image 2 top part: 'Joy nomi', 'Manzil: ...') */}
      <div className="bg-white dark:bg-slate-800/95 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        {/* Place Photo Banner */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-inner bg-slate-900">
          <img
            src={imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {place.category && (
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                {place.category.name}
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                place.is_open
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              }`}
            >
              {place.is_open ? 'Ochiq' : 'Yopiq'}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{place.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title & Address */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {place.name}
          </h1>

          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="font-medium">
              <strong>Manzil:</strong> {place.address}
            </span>
          </div>
        </div>

        {/* Map Box Preview (Matches Image 2 map container with pin) */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          {/* Simulated clean modern map background with pin */}
          <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-bounce">
              <MapPin className="w-6 h-6 fill-white" />
            </div>
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              {formatDistance(place.distance)} yaqinlikda
            </div>
          </div>

          {/* Quick Route Launchers */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('impact', 'medium');
                openGoogleMaps(place.latitude, place.longitude, place.name);
              }}
              className="flex-1 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 hover:bg-white transition-all"
            >
              <Navigation className="w-3 h-3 text-blue-500" />
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => {
                triggerHaptic('impact', 'medium');
                openYandexMaps(place.latitude, place.longitude);
              }}
              className="flex-1 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white font-bold text-[11px] shadow-sm flex items-center justify-center gap-1 hover:bg-white transition-all"
            >
              <Navigation className="w-3 h-3 text-amber-500" />
              <span>Yandex Maps</span>
            </button>
          </div>
        </div>

        {/* 5-Star Rating Display (Matches Image 2) */}
        <div className="flex items-center gap-1.5 pt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= Math.round(place.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          ))}
          <span className="font-extrabold text-sm text-slate-900 dark:text-white ml-2">
            {place.rating.toFixed(1)} / 5.0
          </span>
          <span className="text-xs text-slate-400">({reviews.length} izoh)</span>
        </div>

        {/* Work Hours (Matches Image 2: 'Ish vaqti: 11:00 / 00:00') */}
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white pt-1">
          <Clock className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span>Ish vaqti: {hoursString}</span>
        </div>

        {/* Additional info (Matches Image 2: 'Qo\'shimcha ma\'lumotlar: ...') */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/50">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Qo'shimcha ma'lumotlar:
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {place.description || "Ushbu joy haqida to'liq ma'lumot olish uchun quyidagi telefon orqali bog'lanishingiz mumkin."}
          </p>

          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline pt-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{place.website}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Reviews Section (Matches Image 2: 'Izohlar :') */}
      <div className="bg-white dark:bg-slate-800/95 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4.5 h-4.5 text-emerald-500" />
            <span>Izohlar :</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">{reviews.length} ta fikr</span>
        </div>

        {/* Add Review Input Form (Matches Image 2: 'Izoh qoldirish...') */}
        <form onSubmit={handleAddReview} className="space-y-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Bahoyingizni tanlang:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => {
                    triggerHaptic('selection');
                    setNewRating(star);
                  }}
                  className="p-0.5 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-4.5 h-4.5 ${
                      star <= newRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Izoh qoldirish..."
              className="w-full pl-4 pr-11 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmittingReview}
              className="absolute right-1.5 p-1.5 rounded-lg bg-emerald-500 text-white disabled:opacity-40 hover:bg-emerald-600 active:scale-95 transition-all"
              aria-label="Yuborish"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Reviews List with Emoji Avatars and Speech Bubbles (Matches Image 2) */}
        <div className="space-y-3 pt-1">
          {visibleReviews.map((rev) => (
            <div key={rev.id} className="flex items-start gap-3 animate-in fade-in duration-200">
              {/* Emoji Avatar */}
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shrink-0 shadow-sm border border-slate-200 dark:border-slate-600">
                {rev.avatar_emoji || '😊'}
              </div>

              {/* Speech Bubble Card */}
              <div className="flex-1 bg-sky-50 dark:bg-slate-700/60 p-3 rounded-2xl rounded-tl-none border border-sky-100 dark:border-slate-600/50 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {rev.user_name}
                  </h4>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-2.5 h-2.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {rev.comment}
                </p>

                <span className="block text-[10px] text-slate-400 dark:text-slate-400 pt-0.5">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Expand / Show More Arrow (Matches Image 2 arrow at bottom of reviews) */}
        {reviews.length > 3 && (
          <button
            onClick={() => {
              triggerHaptic('selection');
              setShowAllReviews(!showAllReviews);
            }}
            className="w-full py-2 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>{showAllReviews ? 'Kamroq ko\'rsatish' : 'Barcha izohlarni ko\'rish'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAllReviews ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Fixed Bottom Call Button (Matches Image 2: Green button with phone number) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-900 dark:via-slate-900/95">
        <div className="max-w-md mx-auto">
          <a
            href={`tel:${place.phone || '+998912345678'}`}
            onClick={() => triggerHaptic('impact', 'heavy')}
            className="w-full py-4 rounded-3xl bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-extrabold text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 transition-all tracking-wide"
          >
            <Phone className="w-5 h-5 fill-white" />
            <span>{place.phone || '+998 91 234 56 78'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
