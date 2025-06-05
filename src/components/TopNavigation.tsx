
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Newspaper, Image, Search, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const TopNavigation = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Главная', path: '/' },
    { icon: Map, label: 'Карта', path: '/map' },
    { icon: Newspaper, label: 'Новости', path: '/news' },
    { icon: Image, label: 'Галерея', path: '/gallery' },
    { icon: Search, label: 'Поиск', path: '/search' },
    { icon: Settings, label: 'О предприятии', path: '/about' },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-xl sticky top-0 z-50">
      {/* Логотип и название предприятия */}
      <div className="text-center py-4 border-b border-blue-700">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">П</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Предприятие</h1>
            <p className="text-blue-200 text-sm">Информационная система</p>
          </div>
        </div>
      </div>

      {/* Горизонтальное меню */}
      <nav className="px-4 py-3">
        <div className="flex justify-center space-x-2 max-w-6xl mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation min-w-[80px]',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105'
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white hover:shadow-lg'
                )}
              >
                <Icon 
                  size={24} 
                  className={cn(
                    'mb-1 transition-all duration-300',
                    isActive 
                      ? 'animate-bounce text-white drop-shadow-lg' 
                      : 'group-hover:animate-pulse'
                  )}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Кнопка администрирования */}
      <div className="px-4 pb-3">
        <div className="flex justify-center">
          <Link
            to="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700/80 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm touch-manipulation backdrop-blur-sm"
          >
            <Settings size={16} />
            <span>Администрирование</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
