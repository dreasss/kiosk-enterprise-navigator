
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Image as ImageIcon, ArrowLeft, Play, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedButton } from './ui/animated-button';
import { useIdleRedirect } from '../hooks/useIdleRedirect';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  category: string;
  date: string;
}

const GalleryPage = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Автоматический редирект при бездействии
  useIdleRedirect();

  useEffect(() => {
    // Загрузка галереи из localStorage или демо данные
    const loadGallery = () => {
      const stored = localStorage.getItem('enterprise_gallery');
      if (stored) {
        setGallery(JSON.parse(stored));
      } else {
        const demoGallery: GalleryItem[] = [
          {
            id: '1',
            title: 'Главное здание предприятия',
            description: 'Вид на административное здание с центральной площади',
            type: 'image',
            url: '/placeholder.svg',
            category: 'buildings',
            date: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Производственный цех №1',
            description: 'Современное оборудование и рабочие места',
            type: 'image',
            url: '/placeholder.svg',
            category: 'production',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            title: 'Презентация новых технологий',
            description: 'Видеообзор инновационных решений',
            type: 'video',
            url: '/placeholder.svg',
            thumbnail: '/placeholder.svg',
            category: 'events',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setGallery(demoGallery);
        localStorage.setItem('enterprise_gallery', JSON.stringify(demoGallery));
      }
    };

    loadGallery();
  }, []);

  const categories = [
    { value: 'all', label: 'Все материалы', color: 'bg-blue-500' },
    { value: 'buildings', label: 'Здания', color: 'bg-green-500' },
    { value: 'production', label: 'Производство', color: 'bg-red-500' },
    { value: 'events', label: 'События', color: 'bg-purple-500' }
  ];

  const filteredGallery = selectedCategory === 'all' 
    ? gallery 
    : gallery.filter(item => item.category === selectedCategory);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const openItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">Галерея</h1>
              <p className="text-gray-600 text-lg">Фото и видео материалы предприятия</p>
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

        {/* Галерея */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.length === 0 ? (
            <div className="col-span-full">
              <Card className="shadow-lg">
                <CardContent className="p-12 text-center">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет материалов</h3>
                  <p className="text-gray-500">В выбранной категории пока нет материалов</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredGallery.map(item => (
              <Card 
                key={item.id} 
                className="shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => openItem(item)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={item.thumbnail || item.url} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                      </div>
                    </div>
                  )}
                  <Badge 
                    className="absolute top-3 right-3 bg-white/90 text-gray-800"
                  >
                    {item.type === 'image' ? 'Фото' : 'Видео'}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-800">
                    {item.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    {formatDate(item.date)}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Модальное окно просмотра */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedItem?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="relative">
                {selectedItem.type === 'image' ? (
                  <img 
                    src={selectedItem.url} 
                    alt={selectedItem.title}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Видео плеер будет здесь</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-700 text-lg">{selectedItem.description}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Дата: {formatDate(selectedItem.date)}
                  </p>
                </div>
                <AnimatedButton variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Скачать
                </AnimatedButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
