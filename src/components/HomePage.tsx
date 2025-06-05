
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Image as ImageIcon, Map } from 'lucide-react';
import NewsMarquee from './NewsMarquee';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [recentNews, setRecentNews] = useState([]);
  const [recentGallery, setRecentGallery] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Загрузка последних новостей
    const loadRecentNews = async () => {
      try {
        const stored = localStorage.getItem('enterprise_news');
        if (stored) {
          const news = JSON.parse(stored);
          setRecentNews(news.slice(0, 3));
        }
      } catch (error) {
        console.log('Ошибка загрузки новостей:', error);
      }
    };

    // Загрузка последних фото
    const loadRecentGallery = async () => {
      try {
        const stored = localStorage.getItem('enterprise_gallery');
        if (stored) {
          const gallery = JSON.parse(stored);
          setRecentGallery(gallery.slice(0, 6));
        }
      } catch (error) {
        console.log('Ошибка загрузки галереи:', error);
      }
    };

    loadRecentNews();
    loadRecentGallery();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Бегущая строка новостей */}
      <NewsMarquee />

      {/* Основной контент */}
      <div className="container mx-auto px-6 py-8">
        {/* Приветствие */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
            Добро пожаловать
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Информационная система предприятия
          </p>
          <div className="text-lg text-gray-500">
            {currentTime.toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })} • {currentTime.toLocaleTimeString('ru-RU')}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <Link to="/map">
              <CardHeader className="text-center">
                <Map className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-blue-800">Карта предприятия</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Интерактивная карта с объектами и маршрутами
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <Link to="/news">
              <CardHeader className="text-center">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-green-800">Новости</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Актуальные новости предприятия и отрасли
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
            <Link to="/gallery">
              <CardHeader className="text-center">
                <ImageIcon className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-purple-800">Галерея</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Фото и видео материалы предприятия
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Последние новости */}
        {recentNews.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Последние новости</h2>
              <Link to="/news">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>Все новости</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((news, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{news.description}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(news.date).toLocaleDateString('ru-RU')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Галерея */}
        {recentGallery.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Галерея</h2>
              <Link to="/gallery">
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>Смотреть все</span>
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentGallery.map((item, index) => (
                <div
                  key={index}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white text-xs">Видео</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
