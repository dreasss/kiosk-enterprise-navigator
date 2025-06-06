
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedButton } from './ui/animated-button';
import { useIdleRedirect } from '../hooks/useIdleRedirect';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  image?: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Автоматический редирект при бездействии
  useIdleRedirect();

  useEffect(() => {
    // Загрузка новостей из localStorage или демо данные
    const loadNews = () => {
      const stored = localStorage.getItem('enterprise_news');
      if (stored) {
        setNews(JSON.parse(stored));
      } else {
        const demoNews: NewsItem[] = [
          {
            id: '1',
            title: 'Открытие нового производственного цеха',
            content: 'С радостью сообщаем об открытии современного производственного цеха №3. Новое оборудование позволит увеличить производительность на 30%.',
            date: new Date().toISOString(),
            category: 'production',
            priority: 'high'
          },
          {
            id: '2',
            title: 'Обновление системы безопасности',
            content: 'Завершена модернизация системы контроля доступа. Все сотрудники получат новые пропуски в течение недели.',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            category: 'security',
            priority: 'medium'
          },
          {
            id: '3',
            title: 'График работы на праздничные дни',
            content: 'Уважаемые сотрудники! Обращаем внимание на изменения в графике работы в период праздничных дней.',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'general',
            priority: 'low'
          }
        ];
        setNews(demoNews);
        localStorage.setItem('enterprise_news', JSON.stringify(demoNews));
      }
    };

    loadNews();
  }, []);

  const categories = [
    { value: 'all', label: 'Все новости', color: 'bg-blue-500' },
    { value: 'production', label: 'Производство', color: 'bg-green-500' },
    { value: 'security', label: 'Безопасность', color: 'bg-red-500' },
    { value: 'general', label: 'Общие', color: 'bg-gray-500' }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Новости и события</h1>
              <p className="text-gray-600 text-lg">Актуальная информация предприятия</p>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <AnimatedButton
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.value)}
                  className="text-lg h-12"
                >
                  {category.label}
                </AnimatedButton>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Список новостей */}
        <div className="grid gap-6">
          {filteredNews.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет новостей</h3>
                <p className="text-gray-500">В выбранной категории пока нет новостей</p>
              </CardContent>
            </Card>
          ) : (
            filteredNews.map(item => (
              <Card key={item.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-gray-800 mb-3">
                        {item.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(item.date)}
                        </div>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority === 'high' && 'Важно'}
                          {item.priority === 'medium' && 'Обычное'}
                          {item.priority === 'low' && 'Информация'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
