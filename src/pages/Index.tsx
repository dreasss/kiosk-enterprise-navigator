
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Соединение восстановлено",
        description: "Приложение снова работает в онлайн режиме",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Работа в автономном режиме",
        description: "Некоторые функции могут быть ограничены",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  useEffect(() => {
    // Загрузка Яндекс.Карт
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        console.log('Яндекс.Карты загружены');
      };

      script.onerror = () => {
        console.error('Ошибка загрузки Яндекс.Карт');
      };

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <TopNavigation />
      <main className="min-h-screen">
        {!isOnline && (
          <div className="bg-orange-500 text-white px-4 py-2 text-center animate-pulse">
            Автономный режим - некоторые функции ограничены
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default Index;
