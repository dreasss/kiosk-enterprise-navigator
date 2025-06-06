
import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import { useIdleRedirect } from '../hooks/useIdleRedirect';
import { useEffect, useState } from 'react';

const Layout = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Автоматический редирект при бездействии
  useIdleRedirect(180000); // 3 минуты

  // Отслеживание состояния сети
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Кеширование данных для автономного режима
  useEffect(() => {
    const cacheData = async () => {
      try {
        // Кешируем критически важные данные
        const companyInfo = localStorage.getItem('company_info');
        const mapObjects = localStorage.getItem('map_objects');
        const news = localStorage.getItem('enterprise_news');
        const gallery = localStorage.getItem('enterprise_gallery');

        if (!companyInfo) {
          localStorage.setItem('company_info', JSON.stringify({
            name: 'ООО "Инновационные Технологии"',
            description: 'Современная производственная система',
            logo: '🏭'
          }));
        }

        if (!mapObjects) {
          localStorage.setItem('map_objects', JSON.stringify([
            {
              id: 1,
              name: 'Административное здание',
              description: 'Офисы управления, переговорные комнаты',
              lat: 56.742500,
              lng: 37.192200,
              type: 'office',
              icon: '🏢',
              color: '#3b82f6',
              photos: []
            },
            {
              id: 2,
              name: 'Производственный цех №1',
              description: 'Основное производство, сборочные линии',
              lat: 56.742800,
              lng: 37.191500,
              type: 'production',
              icon: '🏭',
              color: '#ef4444',
              photos: []
            }
          ]));
        }

        console.log('Данные кешированы для автономного режима');
      } catch (error) {
        console.error('Ошибка кеширования данных:', error);
      }
    };

    cacheData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Индикатор состояния сети */}
      {!isOnline && (
        <div className="bg-orange-500 text-white text-center py-2 text-sm font-medium">
          ⚠️ Автономный режим - некоторые функции могут быть ограничены
        </div>
      )}
      
      <TopNavigation />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Индикатор для сенсорного управления */}
      <div className="fixed bottom-4 right-4 bg-black/10 text-white/80 px-3 py-2 rounded-lg text-xs backdrop-blur-sm select-none pointer-events-none">
        👆 Используйте касания для навигации
      </div>
    </div>
  );
};

export default Layout;
