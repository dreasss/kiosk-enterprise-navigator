
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Plus, Edit, Trash, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';

interface MapObject {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: string;
  floor?: string;
}

const AdminMap = () => {
  const [mapObjects, setMapObjects] = useState<MapObject[]>([]);
  const [editingObject, setEditingObject] = useState<MapObject | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    type: 'building',
    floor: ''
  });

  const objectTypes = [
    { value: 'building', label: 'Здание' },
    { value: 'production', label: 'Производство' },
    { value: 'warehouse', label: 'Склад' },
    { value: 'cafeteria', label: 'Столовая' },
    { value: 'parking', label: 'Парковка' },
    { value: 'office', label: 'Офис' },
    { value: 'security', label: 'Охрана' },
    { value: 'entrance', label: 'Вход/Выход' },
    { value: 'other', label: 'Другое' }
  ];

  useEffect(() => {
    loadMapObjects();
  }, []);

  const loadMapObjects = () => {
    try {
      const stored = localStorage.getItem('map_objects');
      if (stored) {
        setMapObjects(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Ошибка загрузки объектов карты:', error);
    }
  };

  const saveMapObjects = (updatedObjects: MapObject[]) => {
    try {
      localStorage.setItem('map_objects', JSON.stringify(updatedObjects));
      setMapObjects(updatedObjects);
    } catch (error) {
      console.log('Ошибка сохранения объектов карты:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast({
        title: "Ошибка",
        description: "Координаты должны быть числами",
        variant: "destructive"
      });
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Ошибка",
        description: "Некорректные координаты",
        variant: "destructive"
      });
      return;
    }

    const mapObject: MapObject = {
      id: editingObject?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      coordinates: [lat, lng],
      type: formData.type,
      floor: formData.floor || undefined
    };

    let updatedObjects;
    if (editingObject) {
      updatedObjects = mapObjects.map(obj => obj.id === editingObject.id ? mapObject : obj);
    } else {
      updatedObjects = [...mapObjects, mapObject];
    }

    saveMapObjects(updatedObjects);
    resetForm();
    setIsDialogOpen(false);
    
    toast({
      title: "Успешно",
      description: editingObject ? "Объект обновлен" : "Объект добавлен"
    });
  };

  const handleEdit = (obj: MapObject) => {
    setEditingObject(obj);
    setFormData({
      name: obj.name,
      description: obj.description,
      latitude: obj.coordinates[0].toString(),
      longitude: obj.coordinates[1].toString(),
      type: obj.type,
      floor: obj.floor || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот объект?')) {
      const updatedObjects = mapObjects.filter(obj => obj.id !== id);
      saveMapObjects(updatedObjects);
      toast({
        title: "Успешно",
        description: "Объект удален"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      type: 'building',
      floor: ''
    });
    setEditingObject(null);
  };

  const getTypeLabel = (type: string) => {
    return objectTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к панели администратора</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Управление картой</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Добавить объект</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingObject ? 'Редактировать объект' : 'Добавить объект'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Введите название объекта"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Описание объекта"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Широта *</label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="55.7558"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Долгота *</label>
                    <Input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="37.6173"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Тип объекта</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    {objectTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Этаж</label>
                  <Input
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="1, 1-5, подвал, и т.д."
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Как получить координаты:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Откройте Яндекс.Карты или Google Maps</li>
                    <li>• Найдите нужное место и кликните по нему</li>
                    <li>• Скопируйте координаты из всплывающего окна</li>
                    <li>• Широта - первое число, долгота - второе</li>
                  </ul>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingObject ? 'Обновить' : 'Добавить'}
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
        {mapObjects.map((obj) => (
          <Card key={obj.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="line-clamp-1">{obj.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{obj.description}</p>
              <dl className="grid grid-cols-3 gap-1 text-sm mb-4">
                <dt className="text-gray-500">Тип:</dt>
                <dd className="col-span-2">{getTypeLabel(obj.type)}</dd>
                
                <dt className="text-gray-500">Координаты:</dt>
                <dd className="col-span-2 font-mono">{obj.coordinates[0].toFixed(4)}, {obj.coordinates[1].toFixed(4)}</dd>
                
                {obj.floor && (
                  <>
                    <dt className="text-gray-500">Этаж:</dt>
                    <dd className="col-span-2">{obj.floor}</dd>
                  </>
                )}
              </dl>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(obj)}
                  className="flex items-center space-x-1 flex-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Редактировать</span>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(obj.id)}
                  className="flex items-center"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mapObjects.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">Объекты не добавлены</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>Добавить первый объект</Button>
            </DialogTrigger>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default AdminMap;
