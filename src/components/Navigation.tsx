import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Newspaper, Image, Search, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

const Navigation = () => {
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
    <nav className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl">
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">П</span>
            </div>
          </div>
          <h1 className="text-xl font-bold">Предприятие</h1>
          <p className="text-blue-200 text-sm">Информационная система</p>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:transform hover:scale-105'
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <Link
          to="/admin"
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 text-sm touch-manipulation"
        >
          <Settings size={16} />
          <span>Администрирование</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
