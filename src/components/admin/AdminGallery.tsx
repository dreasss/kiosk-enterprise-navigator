
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Plus, Edit, Trash, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  date: string;
  category: string;
}

const AdminGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    type: 'image' as 'image' | 'video',
    category: ''
  });

  const categories = [
    'События',
    'Производство', 
    'Продукция',
    'Обучение',
    'Корпоративные мероприятия',
    'Экскурсии',
    'Другое'
  ];

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = () => {
    try {
      const stored = localStorage.getItem('enterprise_gallery');
      if (stored) {
        setGallery(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Ошибка загрузки галереи:', error);
    }
  };

  const saveGallery = (updatedGallery: GalleryItem[]) => {
    try {
      localStorage.setItem('enterprise_gallery', JSON.stringify(updatedGallery));
      setGallery(updatedGallery);
    } catch (error) {
      console.log('Ошибка сохранения галереи:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url) {
      toast({
        title: "Ошибка",
        description: "Заполните обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const galleryItem: GalleryItem = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      url: formData.url,
      type: formData.type,
      category: formData.category || 'Другое',
      date: editingItem?.date || new Date().toISOString()
    };

    let updatedGallery;
    if (editingItem) {
      updatedGallery = gallery.map(item => item.id === editingItem.id ? galleryItem : item);
    } else {
      updatedGallery = [galleryItem, ...gallery];
    }

    saveGallery(updatedGallery);
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Успешно",
      description: editingItem ? "Элемент обновлен" : "Элемент добавлен"
    });
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
      category: item.category
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот элемент?')) {
      const updatedGallery = gallery.filter(item => item.id !== id);
      saveGallery(updatedGallery);
      toast({
        title: "Успешно",
        description: "Элемент удален"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      type: 'image',
      category: ''
    });
    setEditingItem(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // В реальном приложении здесь был бы загрузка файла на сервер
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, url });
      
      // Определение типа файла
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      setFormData(prev => ({ ...prev, type }));
      
      toast({
        title: "Файл загружен",
        description: "URL файла добавлен в поле"
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к панели администратора</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Управление галереей</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Добавить элемент</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Редактировать элемент' : 'Добавить элемент'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введите заголовок"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Описание элемента"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тип контента</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="image">Изображение</option>
                    <option value="video">Видео</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL файла *</label>
                  <div className="space-y-2">
                    <Input
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com/file.jpg или загрузите файл"
                      required
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="flex items-center space-x-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Загрузить файл</span>
                      </Button>
                      <span className="text-sm text-gray-500">или введите URL</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingItem ? 'Обновить' : 'Добавить'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-t-lg">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x300?text=Изображение+недоступно';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Video className="w-12 h-12 text-white opacity-80" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {item.type === 'image' ? (
                    <ImageIcon className="w-5 h-5 text-white bg-black bg-opacity-50 rounded p-1" />
                  ) : (
                    <Video className="w-5 h-5 text-white bg-black bg-opacity-50 rounded p-1" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                  {item.category && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Изменить</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center justify-center"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {gallery.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Галерея пуста</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Добавить первый элемент</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
