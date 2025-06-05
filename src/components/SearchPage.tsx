
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, MapPin, Calendar, Image as ImageIcon, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface SearchableItem {
  id: string;
  title: string;
  description: string;
  type: 'object' | 'news' | 'gallery';
  category?: string;
  date?: string;
  url?: string;
  coordinates?: [number, number];
  letter?: string;
}

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [allItems, setAllItems] = useState<SearchableItem[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split('');

  useEffect(() => {
    loadAllItems();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, selectedLetter, activeFilter, allItems]);

  const loadAllItems = () => {
    try {
      const items: SearchableItem[] = [];

      // Загрузка объектов карты
      const mapObjects = JSON.parse(localStorage.getItem('map_objects') || '[]');
      mapObjects.forEach((obj: any) => {
        items.push({
          id: `map_${obj.id}`,
          title: obj.name,
          description: obj.description,
          type: 'object',
          category: obj.type,
          coordinates: obj.coordinates,
          letter: obj.name.charAt(0).toUpperCase()
        });
      });

      // Загрузка новостей
      const news = JSON.parse(localStorage.getItem('enterprise_news') || '[]');
      news.forEach((item: any) => {
        items.push({
          id: `news_${item.id}`,
          title: item.title,
          description: item.description,
          type: 'news',
          date: item.date,
          letter: item.title.charAt(0).toUpperCase()
        });
      });

      // Загрузка галереи
      const gallery = JSON.parse(localStorage.getItem('enterprise_gallery') || '[]');
      gallery.forEach((item: any) => {
        items.push({
          id: `gallery_${item.id}`,
          title: item.title,
          description: item.description,
          type: 'gallery',
          category: item.category,
          date: item.date,
          url: item.url,
          letter: item.title.charAt(0).toUpperCase()
        });
      });

      setAllItems(items);
    } catch (error) {
      console.log('Ошибка загрузки данных для поиска:', error);
    }
  };

  const performSearch = () => {
    let filtered = [...allItems];

    // Фильтр по типу
    if (activeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === activeFilter);
    }

    // Фильтр по букве
    if (selectedLetter) {
      filtered = filtered.filter(item => item.letter === selectedLetter);
    }

    // Поиск по тексту
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    setSearchResults(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'object':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'news':
        return <Calendar className="w-5 h-5 text-green-600" />;
      case 'gallery':
        return <ImageIcon className="w-5 h-5 text-purple-600" />;
      default:
        return <Search className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'object':
        return 'Объект';
      case 'news':
        return 'Новость';
      case 'gallery':
        return 'Галерея';
      default:
        return 'Неизвестно';
    }
  };

  const SearchResultCard = ({ item }: { item: SearchableItem }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 flex-1">{item.title}</CardTitle>
          <div className="ml-4 flex items-center space-x-2">
            {getTypeIcon(item.type)}
            <span className="text-sm text-gray-500">{getTypeLabel(item.type)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {item.date && (
              <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
            )}
            {item.category && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                {item.category}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            {item.type === 'object' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/map">Показать на карте</Link>
              </Button>
            )}
            {item.type === 'news' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/news">Читать новости</Link>
              </Button>
            )}
            {item.type === 'gallery' && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/gallery">Открыть галерею</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Поиск</h1>
        
        {/* Строка поиска */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск по всему содержимому..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
            >
              Очистить
            </Button>
          )}
        </div>

        {/* Алфавитный указатель */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Поиск по алфавиту</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedLetter === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedLetter('')}
            >
              Все
            </Button>
            {alphabet.map((letter) => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLetter(letter)}
                className="w-10 h-10 p-0"
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        {/* Фильтры */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="object">Объекты</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="gallery">Галерея</TabsTrigger>
          </TabsList>

          <TabsContent value={activeFilter} className="mt-6">
            {/* Результаты поиска */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Результаты поиска ({searchResults.length})
                </h3>
                {(searchQuery || selectedLetter || activeFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLetter('');
                      setActiveFilter('all');
                    }}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((item) => (
                <SearchResultCard key={item.id} item={item} />
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">Ничего не найдено</p>
                <p className="text-gray-400">
                  Попробуйте изменить поисковый запрос или фильтры
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchPage;
