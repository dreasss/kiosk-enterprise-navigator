
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin, Newspaper, Image, Settings, Building, Rss } from 'lucide-react';

const AdminPanel = () => {
  const adminSections = [
    {
      title: 'Управление картой',
      description: 'Добавление и редактирование объектов на карте',
      icon: MapPin,
      path: '/admin/map',
      color: 'bg-blue-500'
    },
    {
      title: 'Управление новостями',
      description: 'Создание и редактирование новостей',
      icon: Newspaper,
      path: '/admin/news',
      color: 'bg-green-500'
    },
    {
      title: 'Управление галереей',
      description: 'Загрузка и организация изображений',
      icon: Image,
      path: '/admin/gallery',
      color: 'bg-purple-500'
    },
    {
      title: 'RSS ленты',
      description: 'Настройка RSS источников новостей',
      icon: Rss,
      path: '/admin/rss',
      color: 'bg-orange-500'
    },
    {
      title: 'Настройки предприятия',
      description: 'Информация о компании и брендинг',
      icon: Building,
      path: '/admin/company',
      color: 'bg-indigo-500'
    },
    {
      title: 'Общие настройки',
      description: 'Системные настройки и конфигурация',
      icon: Settings,
      path: '/admin/settings',
      color: 'bg-gray-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Панель администратора</h1>
        <p className="text-gray-600">Управление системой и контентом</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} to={section.path}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${section.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-800">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPanel;
