
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '../components/Navigation';
import HomePage from '../components/HomePage';
import MapPage from '../components/MapPage';
import NewsPage from '../components/NewsPage';
import GalleryPage from '../components/GalleryPage';
import SearchPage from '../components/SearchPage';
import AboutPage from '../components/AboutPage';
import AdminPanel from '../components/admin/AdminPanel';
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

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex h-screen">
          <Navigation />
          <main className="flex-1 overflow-auto">
            {!isOnline && (
              <div className="bg-orange-500 text-white px-4 py-2 text-center">
                Автономный режим - некоторые функции ограничены
              </div>
            )}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/admin/*" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default Index;
