declare global {
  interface Window {
    Telegram?: {
      WebApp?: any;
    };
  }
}

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramSDK = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    if (tg.enableClosingConfirmation) {
      tg.enableClosingConfirmation();
    }
  }
};

export const triggerHaptic = (type: 'impact' | 'notification' | 'selection' = 'selection', style: 'light' | 'medium' | 'heavy' | 'warning' | 'success' | 'error' = 'light') => {
  const tg = getTelegramWebApp();
  if (tg?.HapticFeedback) {
    if (type === 'impact') {
      tg.HapticFeedback.impactOccurred(style);
    } else if (type === 'notification') {
      tg.HapticFeedback.notificationOccurred(style);
    } else {
      tg.HapticFeedback.selectionChanged();
    }
  }
};

export const getTelegramInitData = (): string => {
  const tg = getTelegramWebApp();
  return tg?.initData || '';
};
