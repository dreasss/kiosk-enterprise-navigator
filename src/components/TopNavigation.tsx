
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, Newspaper, Image, Search, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect } from 'react';

const TopNavigation = () => {
  const location = useLocation();
  const [companyInfo, setCompanyInfo] = useState({
    name: 'ООО "Инновационные Технологии"',
    description: 'Современная производственная система',
    logo: '🏭'
  });

  // Загрузка информации о компании из localStorage
  useEffect(() => {
    const loadCompanyInfo = () => {
      const stored = localStorage.getItem('company_info');
      if (stored) {
        setCompanyInfo(JSON.parse(stored));
      }
    };

    loadCompanyInfo();

    // Слушаем события обновления информации о компании
    const handleCompanyInfoUpdate = (event: CustomEvent) => {
      setCompanyInfo(event.detail);
    };

    window.addEventListener('companyInfoUpdated', handleCompanyInfoUpdate as EventListener);

    return () => {
      window.removeEventListener('companyInfoUpdated', handleCompanyInfoUpdate as EventListener);
    };
  }, []);

  const menuItems = [
    { icon: Home, label: 'Главная', path: '/', color: '#3b82f6' },
    { icon: Map, label: 'Карта', path: '/map', color: '#10b981' },
    { icon: Newspaper, label: 'Новости', path: '/news', color: '#f59e0b' },
    { icon: Image, label: 'Галерея', path: '/gallery', color: '#8b5cf6' },
    { icon: Search, label: 'Поиск', path: '/search', color: '#ef4444' },
    { icon: Settings, label: 'О предприятии', path: '/about', color: '#6b7280' },
  ];

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-2xl sticky top-0 z-50 border-b border-blue-800/30">
      {/* Логотип и название предприятия */}
      <div className="text-center py-6 border-b border-blue-800/50 bg-gradient-to-r from-blue-900/50 to-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {typeof companyInfo.logo === 'string' && companyInfo.logo.startsWith('data:') ? (
                <img src={companyInfo.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover transform -rotate-3" />
              ) : (
                <span className="text-3xl transform -rotate-3">{companyInfo.logo}</span>
              )}
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              {companyInfo.name}
            </h1>
            <p className="text-blue-200 text-sm font-medium mt-1">
              {companyInfo.description}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-300 font-medium">Система активна</span>
            </div>
          </div>
        </div>
      </div>

      {/* Горизонтальное меню */}
      <nav className="px-6 py-4 bg-gradient-to-r from-slate-800/80 to-blue-800/80 backdrop-blur-sm">
        <div className="flex justify-center space-x-3 max-w-7xl mx-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'group flex flex-col items-center justify-center px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 touch-manipulation min-w-[100px] relative overflow-hidden',
                  isActive
                    ? 'bg-gradient-to-br from-white/20 to-white/10 text-white shadow-2xl scale-110 ring-2 ring-white/30'
                    : 'text-blue-100 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:text-white hover:shadow-xl'
                )}
                style={{
                  boxShadow: isActive 
                    ? `0 8px 32px ${item.color}40, 0 0 0 1px ${item.color}30` 
                    : undefined
                }}
              >
                {/* Фоновый эффект для активного элемента */}
                {isActive && (
                  <div 
                    className="absolute inset-0 opacity-20 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`
                    }}
                  />
                )}
                
                <Icon 
                  size={28}
                  className={cn(
                    'mb-2 transition-all duration-300 relative z-10',
                    isActive 
                      ? 'text-white drop-shadow-lg scale-110' 
                      : 'group-hover:scale-110'
                  )}
                  style={{
                    color: isActive ? item.color : undefined,
                    filter: isActive ? 'drop-shadow(0 0 8px currentColor)' : undefined
                  }}
                />
                <span className={cn(
                  'text-sm font-semibold transition-all duration-300 relative z-10',
                  isActive ? 'text-white' : 'group-hover:text-white'
                )}>
                  {item.label}
                </span>
                
                {/* Индикатор активности */}
                {isActive && (
                  <div 
                    className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Кнопка администрирования */}
      <div className="px-6 pb-4 bg-gradient-to-r from-slate-800/60 to-blue-800/60">
        <div className="flex justify-center">
          <Link
            to="/admin"
            className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-gray-700/80 to-gray-800/80 hover:from-gray-600/90 hover:to-gray-700/90 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm touch-manipulation backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70 shadow-lg hover:shadow-xl"
          >
            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Панель администратора</span>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
