
import { useState, useEffect } from 'react';

const NewsMarquee = () => {
  const [newsItems, setNewsItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        // Загрузка внутренних новостей
        const internalNews = JSON.parse(localStorage.getItem('enterprise_news') || '[]');
        
        // Загрузка RSS новостей
        const rssSettings = JSON.parse(localStorage.getItem('rss_settings') || '{}');
        let rssNews = [];
        
        if (rssSettings.enabled && rssSettings.url) {
          try {
            // В реальном приложении здесь будет запрос к RSS API
            rssNews = JSON.parse(localStorage.getItem('rss_news') || '[]');
          } catch (error) {
            console.log('Ошибка загрузки RSS:', error);
          }
        }

        // Объединение и сортировка новостей
        const allNews = [...internalNews, ...rssNews]
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10)
          .map((item: any) => item.title);

        setNewsItems(allNews.length > 0 ? allNews : ['Добро пожаловать в информационную систему предприятия']);
      } catch (error) {
        console.log('Ошибка загрузки новостей для бегущей строки:', error);
        setNewsItems(['Добро пожаловать в информационную систему предприятия']);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
    
    // Обновление каждые 5 минут
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-blue-600 text-white py-2 overflow-hidden">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-500 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        <div className="marquee-container">
          <div className="marquee-content">
            {newsItems.map((item, index) => (
              <span key={index} className="mx-8 text-lg font-medium whitespace-nowrap">
                • {item}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          display: flex;
          animation: marquee 60s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </>
  );
};

export default NewsMarquee;
