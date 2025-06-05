import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Settings, Newspaper, Image as ImageIcon, Map, Rss, Building, Palette, ArrowLeft } from 'lucide-react';
import AdminNews from './AdminNews';
import AdminGallery from './AdminGallery';
import AdminMap from './AdminMap';
import AdminRSS from './AdminRSS';
import AdminCompany from './AdminCompany';
import AdminBranding from './AdminBranding';

const AdminPanel = () => {
  const location = useLocation();
  const isMainPanel = location.pathname === '/admin' || location.pathname === '/admin/';

  const adminMenuItems = [
    {
      icon: Newspaper,
      title: 'Управление новостями',
      description: 'Добавление, редактирование и удаление новостей предприятия',
      path: '/admin/news',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: ImageIcon,
      title: 'Управление галереей',
      description: 'Загрузка и управление фото и видео контентом',
      path: '/admin/gallery',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Map,
      title: 'Управление картой',
      description: 'Добавление и редактирование объектов на карте предприятия',
      path: '/admin/map',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Rss,
      title: 'Настройка RSS',
      description: 'Управление внешними RSS-лентами и бегущей строкой',
      path: '/admin/rss',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Building,
      title: 'Информация о предприятии',
      description: 'Редактирование содержимого раздела "О предприятии"',
      path: '/admin/company',
      color: 'from-gray-500 to-gray-600'
    },
    {
      icon: Palette,
      title: 'Брендинг',
      description: 'Настройка логотипа, цветов и шрифтов интерфейса',
      path: '/admin/branding',
      color: 'from-pink-500 to-pink-600'
    }
  ];

  if (isMainPanel) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться к приложению</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Административная панель</h1>
          <p className="text-gray-600">Управление содержимым информационной системы предприятия</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Системная информация */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Системная информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-2">Активно</div>
                  <div className="text-gray-600">Состояние системы</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">v1.0.0</div>
                  <div className="text-gray-600">Версия системы</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-2">
                    {new Date().toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-gray-600">Последнее обновление</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="news" element={<AdminNews />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="map" element={<AdminMap />} />
        <Route path="rss" element={<AdminRSS />} />
        <Route path="company" element={<AdminCompany />} />
        <Route path="branding" element={<AdminBranding />} />
      </Routes>
    </div>
  );
};

export default AdminPanel;
