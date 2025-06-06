
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { MapPin, Navigation, Clock, Users, Building2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIdleRedirect } from '../hooks/useIdleRedirect';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: '22°C', condition: 'Ясно' });

  // Автоматический редирект при бездействии (но не для главной страницы)
  // useIdleRedirect(); // Закомментируем для главной страницы

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      title: 'Карта предприятия',
      description: 'Найдите нужный объект и постройте маршрут',
      icon: MapPin,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      path: '/map'
    },
    {
      title: 'Новости и события',
      description: 'Актуальная информация о предприятии',
      icon: Calendar,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      path: '/news'
    },
    {
      title: 'О предприятии',
      description: 'История, миссия и достижения компании',
      icon: Building2,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      path: '/about'
    },
    {
      title: 'Галерея',
      description: 'Фотографии и видео предприятия',
      icon: Users,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      path: '/gallery'
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Заголовок и время */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
              Добро пожаловать!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Информационный киоск предприятия
            </p>
          </div>
          
          {/* Время и дата */}
          <Card className="max-w-md mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl md:text-4xl font-mono font-bold text-blue-600 mb-2">
                {formatTime(currentTime)}
              </div>
              <div className="text-gray-600 text-lg capitalize">
                {formatDate(currentTime)}
              </div>
              <div className="mt-3 flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {weather.condition}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {weather.temp}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Быстрые действия */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            Выберите раздел
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.path}>
                  <Card className="h-full shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform mx-auto`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl text-center text-gray-800 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {action.description}
                      </p>
                      <div className={`mt-4 p-3 ${action.bgColor} rounded-lg`}>
                        <span className={`${action.textColor} font-medium`}>
                          Нажмите для перехода
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
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Полезная информация
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">08:00 - 18:00</div>
                <div className="text-gray-600">Рабочие часы</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">+7 (495) 123-45-67</div>
                <div className="text-gray-600">Справочная служба</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">📍</div>
                <div className="text-gray-600">Вы находитесь в киоске</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Подсказка для пользователей */}
        <div className="text-center text-gray-600 text-lg">
          <p>Используйте сенсорный экран для навигации по системе</p>
          <p className="text-sm mt-2 opacity-75">
            При бездействии в течение 3 минут произойдет автоматический возврат на главную страницу
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
