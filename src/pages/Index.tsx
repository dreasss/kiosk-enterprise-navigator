
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { MapPin, Navigation, Clock, Users, Building2, Calendar, Wifi, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: '22°C', condition: 'Ясно' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    activeUsers: 1,
    systemUptime: '99.9%'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Отслеживание состояния сети
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Загрузка статистики из localStorage
    const loadStats = () => {
      const stored = localStorage.getItem('kiosk_stats');
      if (stored) {
        setStats(JSON.parse(stored));
      } else {
        // Инициализация статистики
        const initialStats = {
          totalVisitors: Math.floor(Math.random() * 1000) + 500,
          activeUsers: 1,
          systemUptime: '99.9%'
        };
        localStorage.setItem('kiosk_stats', JSON.stringify(initialStats));
        setStats(initialStats);
      }
    };

    loadStats();

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const quickActions = [
    {
      title: 'Карта предприятия',
      description: 'Интерактивная карта с навигацией и маршрутами',
      icon: MapPin,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/map',
      available: true
    },
    {
      title: 'Новости и события',
      description: 'Актуальная информация и объявления',
      icon: Calendar,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/news',
      available: true
    },
    {
      title: 'О предприятии',
      description: 'История, структура и достижения',
      icon: Building2,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/about',
      available: true
    },
    {
      title: 'Галерея',
      description: 'Фото и видео материалы',
      icon: Users,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/gallery',
      available: true
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Заголовок и время */}
        <div className="text-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 drop-shadow-sm">
              Добро пожаловать!
            </h1>
            <p className="text-2xl md:text-3xl text-gray-600 font-medium">
              Информационный киоск предприятия
            </p>
          </div>
          
          {/* Время, дата и статус */}
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-4xl md:text-5xl font-mono font-bold text-blue-600 mb-3">
                  {formatTime(currentTime)}
                </div>
                <div className="text-gray-600 text-xl capitalize mb-4">
                  {formatDate(currentTime)}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {weather.condition}
                  </Badge>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {weather.temp}
                  </Badge>
                  <Badge variant={isOnline ? "default" : "destructive"} className="text-sm px-3 py-1">
                    {isOnline ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
                    {isOnline ? 'Онлайн' : 'Автономно'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Статистика системы */}
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalVisitors}</div>
                    <div className="text-sm text-gray-600">Посетителей</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                    <div className="text-sm text-gray-600">Активных</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{stats.systemUptime}</div>
                    <div className="text-sm text-gray-600">Аптайм</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
            Выберите раздел
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path} className="group">
                  <Card className={`h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 cursor-pointer ${
                    action.available ? 'hover:shadow-3xl' : 'opacity-60 cursor-not-allowed'
                  }`}>
                    <CardHeader className="pb-6">
                      <div className={`w-20 h-20 ${action.color} rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform mx-auto`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <CardTitle className="text-2xl md:text-3xl text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 text-xl leading-relaxed mb-6">
                        {action.description}
                      </p>
                      <div className={`p-4 ${action.bgColor} rounded-xl`}>
                        <span className={`${action.textColor} font-semibold text-lg flex items-center justify-center gap-2`}>
                          Нажмите для перехода
                          <Navigation className="w-5 h-5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Информационная панель */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-800">
              Полезная информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-3">
                <div className="text-3xl font-bold text-blue-600">08:00 - 18:00</div>
                <div className="text-gray-600 text-lg">Рабочие часы</div>
              </div>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-green-600">+7 (495) 123-45-67</div>
                <div className="text-gray-600 text-lg">Справочная служба</div>
              </div>
              <div className="space-y-3">
                <div className="text-3xl">📍</div>
                <div className="text-gray-600 text-lg">Информационный киоск</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Инструкции для пользователей */}
        <div className="text-center text-gray-600 text-xl space-y-4">
          <p className="font-medium">Используйте сенсорный экран для навигации по системе</p>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span>Система активна</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Автовозврат через 3 мин бездействия</span>
            </div>
            {!isOnline && (
              <div className="flex items-center gap-2 text-orange-600">
                <WifiOff className="w-5 h-5" />
                <span>Работа в автономном режиме</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
