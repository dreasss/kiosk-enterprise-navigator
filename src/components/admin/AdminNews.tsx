
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Plus, Edit, Trash, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
}

const AdminNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    try {
      const stored = localStorage.getItem('enterprise_news');
      if (stored) {
        setNews(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Ошибка загрузки новостей:', error);
    }
  };

  const saveNews = (updatedNews: NewsItem[]) => {
    try {
      localStorage.setItem('enterprise_news', JSON.stringify(updatedNews));
      setNews(updatedNews);
    } catch (error) {
      console.log('Ошибка сохранения новостей:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.content) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const newsItem: NewsItem = {
      id: editingNews?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      content: formData.content,
      author: formData.author || 'Администратор',
      date: editingNews?.date || new Date().toISOString()
    };

    let updatedNews;
    if (editingNews) {
      updatedNews = news.map(item => item.id === editingNews.id ? newsItem : item);
    } else {
      updatedNews = [newsItem, ...news];
    }

    saveNews(updatedNews);
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Успешно",
      description: editingNews ? "Новость обновлена" : "Новость добавлена"
    });
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content,
      author: newsItem.author
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      const updatedNews = news.filter(item => item.id !== id);
      saveNews(updatedNews);
      toast({
        title: "Успешно",
        description: "Новость удалена"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      author: ''
    });
    setEditingNews(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к панели администратора</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Управление новостями</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Добавить новость</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? 'Редактировать новость' : 'Добавить новость'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Заголовок *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Введите заголовок новости"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Краткое описание *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Краткое описание для превью"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Полный текст *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Полный текст новости"
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Автор</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Имя автора (по умолчанию: Администратор)"
                  />
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingNews ? 'Обновить' : 'Добавить'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                </span>
                <span>Автор: {item.author}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Редактировать</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center space-x-1"
                >
                  <Trash className="w-4 h-4" />
                  <span>Удалить</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Новостей пока нет</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Добавить первую новость</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminNews;
