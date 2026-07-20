'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { initTelegramSDK, getTelegramInitData, getTelegramWebApp } from '@/lib/telegram';
import { authApi } from '@/lib/api';

interface TelegramContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  telegramWebApp: any;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  telegramWebApp: null,
});

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [telegramWebApp, setTelegramWebApp] = useState<any>(null);

  useEffect(() => {
    initTelegramSDK();
    const tg = getTelegramWebApp();
    setTelegramWebApp(tg);

    const authenticate = async () => {
      try {
        const initData = getTelegramInitData();
        if (initData) {
          const res = await authApi.loginTelegram(initData);
          setUser(res.user);
        } else {
          // Development / Standalone fallback profile
          try {
            const profile = await authApi.getProfile();
            setUser(profile);
          } catch (e) {
            // Mock profile if backend unreachable locally
            setUser({
              id: 1,
              telegram_id: 123456789,
              first_name: 'Guest User',
              language: 'en',
              latitude: 41.311081,
              longitude: 69.240562,
            });
          }
        }
      } catch (error) {
        console.error('Telegram authentication failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        telegramWebApp,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
