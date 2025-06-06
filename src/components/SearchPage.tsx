
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Search, ArrowLeft, MapPin, FileText, Image as ImageIcon, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedButton } from './ui/animated-button';
import { Input } from './ui/input';
import { useIdleRedirect } from '../hooks/useIdleRedirect';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'map' | 'news' | 'gallery' | 'about';
  url: string;
  date?: string;
  category?: string;
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Автоматический редирект при бездействии
  useIdleRedirect();

  // Демо данные для поиска
  const allContent: SearchResult[] = [
    {
      id: '1',
      title: 'Главное здание',
      description: 'Административное здание предприятия с офисами управления',
      type: 'map',
      url: '/map',
      category: 'Объекты карты'
    },
    {
      id: '2',
      title: 'Производственный цех №1',
      description: 'Основное производство, сборочные линии',
      type: 'map',
      url: '/map',
      category: 'Объекты карты'
    },
    {
      id: '3',
      title: 'Открытие нового производственного цеха',
      description: 'С радостью сообщаем об открытии современного производственного цеха №3',
      type: 'news',
      url: '/news',
      date: new Date().toISOString(),
      category: 'Новости'
    },
    {
      id: '4',
      title: 'О предприятии',
      description: 'История, структура и достижения нашего предприятия',
      type: 'about',
      url: '/about',
      category: 'Информация'
    },
    {
      id: '5',
      title: 'Галерея фотографий',
      description: 'Фото и видео материалы предприятия',
      type: 'gallery',
      url: '/gallery',
      category: 'Медиа'
    }
  ];

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Имитация задержки поиска
    setTimeout(() => {
      const results = allContent.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'map': return MapPin;
      case 'news': return Calendar;
      case 'gallery': return ImageIcon;
      case 'about': return FileText;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'map': return 'bg-blue-100 text-blue-800';
      case 'news': return 'bg-green-100 text-green-800';
      case 'gallery': return 'bg-purple-100 text-purple-800';
      case 'about': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <AnimatedButton variant="outline" size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                На главную
              </AnimatedButton>
            </Link>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Поиск</h1>
              <p className="text-gray-600 text-lg">Найдите нужную информацию</p>
            </div>
          </div>
        </div>

        {/* Поисковая строка */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <Input
                placeholder="Введите поисковый запрос..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 text-xl border-2 border-gray-200 focus:border-blue-400 transition-colors rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Результаты поиска */}
        <div className="space-y-4">
          {isSearching ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Поиск...</p>
              </CardContent>
            </Card>
          ) : searchQuery && searchResults.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ничего не найдено</h3>
                <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
              </CardContent>
            </Card>
          ) : searchResults.length > 0 ? (
            <>
              <div className="text-gray-600 text-lg">
                Найдено результатов: <span className="font-semibold">{searchResults.length}</span>
              </div>
              {searchResults.map(result => {
                const IconComponent = getTypeIcon(result.type);
                return (
                  <Link key={result.id} to={result.url}>
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <IconComponent className="w-6 h-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                                  {result.title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-3">
                                  {result.description}
                                </p>
                                <div className="flex items-center space-x-3">
                                  <Badge className={getTypeColor(result.type)}>
                                    {result.category}
                                  </Badge>
                                  {result.date && (
                                    <span className="text-sm text-gray-500">
                                      {formatDate(result.date)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </>
          ) : (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Введите поисковый запрос</h3>
                <p className="text-gray-500">Начните ввод для поиска по всем разделам</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
