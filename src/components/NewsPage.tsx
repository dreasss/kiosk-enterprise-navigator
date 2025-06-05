
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Calendar, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author?: string;
  source?: string;
  isExternal?: boolean;
  url?: string;
}

const NewsPage = () => {
  const [internalNews, setInternalNews] = useState<NewsItem[]>([]);
  const [externalNews, setExternalNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('internal');

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    try {
      // Загрузка внутренних новостей
      const stored = localStorage.getItem('enterprise_news');
      if (stored) {
        setInternalNews(JSON.parse(stored));
      } else {
        // Демо данные
        const demoNews: NewsItem[] = [
          {
            id: '1',
            title: 'Запуск нового производственного цеха',
            description: 'На предприятии открылся современный производственный цех с новейшим оборудованием',
            content: 'Сегодня состоялось торжественное открытие нового производственного цеха. Цех оснащен современным автоматизированным оборудованием, что позволит увеличить производительность на 30% и улучшить качество продукции.',
            date: new Date().toISOString(),
            author: 'Администрация предприятия'
          },
          {
            id: '2',
            title: 'Обновление системы безопасности',
            description: 'Внедрена новая система контроля доступа и видеонаблюдения',
            content: 'В рамках модернизации инфраструктуры предприятия была установлена современная система безопасности. Новая система включает биометрические сканеры, камеры высокого разрешения и интеллектуальную систему анализа.',
            date: new Date(Date.now() - 86400000).toISOString(),
            author: 'Служба безопасности'
          },
          {
            id: '3',
            title: 'Экологическая инициатива',
            description: 'Предприятие присоединилось к программе "Зеленое производство"',
            content: 'Наше предприятие стало участником федеральной программы "Зеленое производство". В рамках программы планируется внедрение энергосберегающих технологий и системы переработки отходов.',
            date: new Date(Date.now() - 172800000).toISOString(),
            author: 'Экологический отдел'
          }
        ];
        setInternalNews(demoNews);
        localStorage.setItem('enterprise_news', JSON.stringify(demoNews));
      }

      // Загрузка внешних новостей (RSS)
      const rssNews = JSON.parse(localStorage.getItem('rss_news') || '[]');
      setExternalNews(rssNews);
      
      // Симуляция загрузки RSS если нет данных
      if (rssNews.length === 0) {
        const demoRssNews: NewsItem[] = [
          {
            id: 'rss1',
            title: 'Новые технологии в промышленности',
            description: 'Обзор последних технологических решений для промышленных предприятий',
            content: 'Краткое описание новостей из внешних источников...',
            date: new Date().toISOString(),
            source: 'Промышленный вестник',
            isExternal: true,
            url: 'https://example.com/news1'
          },
          {
            id: 'rss2',
            title: 'Изменения в отраслевом законодательстве',
            description: 'Важные изменения в нормативно-правовой базе',
            content: 'Краткое описание новостей из внешних источников...',
            date: new Date(Date.now() - 43200000).toISOString(),
            source: 'Правовой навигатор',
            isExternal: true,
            url: 'https://example.com/news2'
          }
        ];
        setExternalNews(demoRssNews);
        localStorage.setItem('rss_news', JSON.stringify(demoRssNews));
      }
    } catch (error) {
      console.log('Ошибка загрузки новостей:', error);
    }
  };

  const filterNews = (news: NewsItem[]) => {
    if (!searchQuery) return news;
    return news.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const NewsCard = ({ news }: { news: NewsItem }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2 flex-1">{news.title}</CardTitle>
          {news.isExternal && (
            <ExternalLink className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(news.date).toLocaleDateString('ru-RU')}</span>
          </span>
          {news.author && (
            <span>Автор: {news.author}</span>
          )}
          {news.source && (
            <span>Источник: {news.source}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4 line-clamp-3">{news.description}</p>
        {news.content !== news.description && (
          <p className="text-gray-700 mb-4 line-clamp-4">{news.content}</p>
        )}
        {news.isExternal && news.url && (
          <Button variant="outline" size="sm" asChild>
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              Читать полностью
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Новости</h1>
        
        {/* Поиск */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="internal">Новости предприятия</TabsTrigger>
            <TabsTrigger value="external">Отраслевые новости</TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNews(internalNews).map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
            {filterNews(internalNews).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Новостей не найдено</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="external" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterNews(externalNews).map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
            {filterNews(externalNews).length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Внешних новостей не найдено</p>
                <p className="text-sm text-gray-400 mt-2">
                  Настройте RSS-ленту в административной панели
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NewsPage;
