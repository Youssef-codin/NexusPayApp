import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const setOnline = () => setIsOnline(true);
    const setOffline = () => setIsOnline(false);
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);
    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  async function retry() {
    setIsRetrying(true);
    try {
      await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      setIsRetrying(false);
    }
  }

  return { isOnline, isRetrying, retry };
}
