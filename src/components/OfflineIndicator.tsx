
import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('Подключение к сети восстановлено');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('Соединение с сетью потеряно, переход в автономный режим');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <Card className="bg-orange-500 border-orange-600 text-white shadow-xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <WifiOff className="w-6 h-6 animate-pulse" />
              <div>
                <div className="font-semibold">Автономный режим</div>
                <div className="text-sm opacity-90">Используются кешированные данные</div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              {showDetails ? 'Скрыть' : 'Подробнее'}
            </Button>
          </div>
          
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-orange-400 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Download className="w-4 h-4" />
                <span>Карта и объекты доступны локально</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Некоторые функции могут быть ограничены</span>
              </div>
              <div className="text-xs opacity-75 mt-2">
                Система автоматически восстановит полную функциональность при подключении к сети
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OfflineIndicator;
