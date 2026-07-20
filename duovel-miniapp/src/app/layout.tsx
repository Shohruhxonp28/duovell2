import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { TelegramProvider } from '@/context/TelegramContext';
import { LocationProvider } from '@/context/LocationContext';
import { Header } from '@/components/common/Header';
import { BottomNavbar } from '@/components/common/BottomNavbar';

export const metadata: Metadata = {
  title: 'Duovel - Discover Nearby Places & Services',
  description: 'Telegram Mini App to find nearby restaurants, cafes, clinics, pharmacies, auto services, beauty salons, and hotels.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen pb-20 transition-colors">
        <ThemeProvider>
          <TelegramProvider>
            <LocationProvider>
              <div className="flex flex-col min-h-screen max-w-md mx-auto relative bg-white dark:bg-slate-900 shadow-2xl border-x border-slate-100 dark:border-slate-800">
                <Header />
                <main className="flex-1 px-4 py-4">{children}</main>
                <BottomNavbar />
              </div>
            </LocationProvider>
          </TelegramProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
