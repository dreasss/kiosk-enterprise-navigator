
import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Image as ImageIcon, Video, X, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  date: string;
  category?: string;
}

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = () => {
    try {
      const stored = localStorage.getItem('enterprise_gallery');
      if (stored) {
        setGalleryItems(JSON.parse(stored));
      } else {
        // Демо данные
        const demoItems: GalleryItem[] = [
          {
            id: '1',
            title: 'Открытие нового цеха',
            description: 'Торжественное открытие производственного цеха',
            url: 'https://picsum.photos/800/600?random=1',
            type: 'image',
            date: new Date().toISOString(),
            category: 'События'
          },
          {
            id: '2',
            title: 'Рабочий процесс',
            description: 'Сотрудники за работой в цехе',
            url: 'https://picsum.photos/800/600?random=2',
            type: 'image',
            date: new Date(Date.now() - 86400000).toISOString(),
            category: 'Производство'
          },
          {
            id: '3',
            title: 'Презентация продукции',
            description: 'Видео-презентация новой продукции',
            url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            type: 'video',
            date: new Date(Date.now() - 172800000).toISOString(),
            category: 'Продукция'
          },
          {
            id: '4',
            title: 'Корпоративное мероприятие',
            description: 'Фотографии с корпоративного мероприятия',
            url: 'https://picsum.photos/800/600?random=4',
            type: 'image',
            date: new Date(Date.now() - 259200000).toISOString(),
            category: 'События'
          },
          {
            id: '5',
            title: 'Технологический процесс',
            description: 'Демонстрация технологического процесса',
            url: 'https://picsum.photos/800/600?random=5',
            type: 'image',
            date: new Date(Date.now() - 345600000).toISOString(),
            category: 'Производство'
          },
          {
            id: '6',
            title: 'Обучение персонала',
            description: 'Видео процесса обучения новых сотрудников',
            url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
            type: 'video',
            date: new Date(Date.now() - 432000000).toISOString(),
            category: 'Обучение'
          }
        ];
        setGalleryItems(demoItems);
        localStorage.setItem('enterprise_gallery', JSON.stringify(demoItems));
      }
    } catch (error) {
      console.log('Ошибка загрузки галереи:', error);
    }
  };

  const filterItems = () => {
    let filtered = galleryItems;

    // Фильтр по типу
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.type === activeTab);
    }

    // Фильтр по поиску
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const GalleryItemCard = ({ item }: { item: GalleryItem }) => (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
      onClick={() => setSelectedItem(item)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-t-lg">
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600?text=Изображение+недоступно';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
              <Play className="w-12 h-12 text-white opacity-80" />
              <div className="absolute top-2 right-2">
                <Video className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {item.type === 'image' ? (
                <ImageIcon className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
            {item.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {item.category}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Галерея</h1>
        
        {/* Поиск */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск в галерее..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Фильтры */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="image">Фото</TabsTrigger>
            <TabsTrigger value="video">Видео</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterItems().map((item) => (
                <GalleryItemCard key={item.id} item={item} />
              ))}
            </div>
            {filterItems().length === 0 && (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Элементов не найдено</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Модальное окно просмотра */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedItem?.title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x600?text=Изображение+недоступно';
                    }}
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    controls
                    className="w-full h-full"
                    onError={(e) => {
                      console.log('Ошибка загрузки видео:', e);
                    }}
                  >
                    Ваш браузер не поддерживает воспроизведение видео.
                  </video>
                )}
              </div>
              <div>
                <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Дата: {new Date(selectedItem.date).toLocaleDateString('ru-RU')}</span>
                  {selectedItem.category && (
                    <span>Категория: {selectedItem.category}</span>
                  )}
                  <span>Тип: {selectedItem.type === 'image' ? 'Фото' : 'Видео'}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
