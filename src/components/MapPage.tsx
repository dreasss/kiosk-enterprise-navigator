import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Navigation as NavigationIcon, MapPin, QrCode, Download, Filter, BarChart3, Clock, Route, Upload, Camera, Palette } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import QRCode from 'qrcode';
import { AnimatedButton } from './ui/animated-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface MapObject {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: string;
  floor?: string;
  capacity?: string;
  workingHours?: string;
  photos?: string[];
  customIcon?: string;
  iconColor?: string;
}

const MapPage = () => {
  const [mapObjects, setMapObjects] = useState<MapObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [routeFrom, setRouteFrom] = useState<MapObject | null>(null);
  const [routeTo, setRouteTo] = useState<MapObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [routeQRCode, setRouteQRCode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [editingObject, setEditingObject] = useState<MapObject | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const { toast } = useToast();

  // Координаты постоянной точки "Вы здесь"
  const currentLocation: [number, number] = [56.742252, 37.191930];

  const objectTypes = [
    { value: 'all', label: 'Все объекты', color: '#6366f1', icon: '🏢', count: 0 },
    { value: 'building', label: 'Здания', color: '#0066CC', icon: '🏢', count: 0 },
    { value: 'production', label: 'Производство', color: '#CC0000', icon: '🏭', count: 0 },
    { value: 'warehouse', label: 'Склады', color: '#996633', icon: '📦', count: 0 },
    { value: 'cafeteria', label: 'Столовые', color: '#00CC66', icon: '🍽️', count: 0 },
    { value: 'parking', label: 'Парковки', color: '#666666', icon: '🚗', count: 0 },
    { value: 'office', label: 'Офисы', color: '#ff6b35', icon: '💼', count: 0 },
    { value: 'security', label: 'Охрана', color: '#8b5cf6', icon: '🛡️', count: 0 }
  ];

  const predefinedIcons = [
    '🏢', '🏭', '📦', '🍽️', '🚗', '💼', '🛡️', '🏪', '🏥', '🎯', '⚡', '🔧', '📋', '💻', '📞'
  ];

  const predefinedColors = [
    '#0066CC', '#CC0000', '#996633', '#00CC66', '#666666', '#ff6b35', '#8b5cf6',
    '#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#34495e'
  ];

  useEffect(() => {
    // Загрузка объектов карты
    const loadMapObjects = () => {
      try {
        const stored = localStorage.getItem('map_objects');
        if (stored) {
          setMapObjects(JSON.parse(stored));
        } else {
          // Расширенные демо данные
          const demoObjects: MapObject[] = [
            {
              id: '1',
              name: 'Главное здание',
              description: 'Административное здание предприятия',
              coordinates: [56.742352, 37.192030],
              type: 'building',
              floor: '1-5',
              capacity: '200 сотрудников',
              workingHours: '08:00-18:00',
              photos: []
            },
            {
              id: '2',
              name: 'Производственный цех №1',
              description: 'Основное производство',
              coordinates: [56.742452, 37.192130],
              type: 'production',
              floor: '1',
              capacity: '50 рабочих мест',
              workingHours: '24/7',
              photos: []
            },
            {
              id: '3',
              name: 'Склад материалов',
              description: 'Складские помещения для сырья',
              coordinates: [56.742152, 37.191830],
              type: 'warehouse',
              floor: '1',
              capacity: '1000 м²',
              workingHours: '06:00-22:00',
              photos: []
            },
            {
              id: '4',
              name: 'Столовая "Уют"',
              description: 'Место питания сотрудников',
              coordinates: [56.742302, 37.192080],
              type: 'cafeteria',
              floor: '1',
              capacity: '150 посадочных мест',
              workingHours: '08:00-17:00',
              photos: []
            },
            {
              id: '5',
              name: 'Парковка А',
              description: 'Основная парковка для сотрудников',
              coordinates: [56.742202, 37.191780],
              type: 'parking',
              floor: '0',
              capacity: '80 мест',
              workingHours: '24/7',
              photos: []
            }
          ];
          setMapObjects(demoObjects);
          localStorage.setItem('map_objects', JSON.stringify(demoObjects));
        }
      } catch (error) {
        console.log('Ошибка загрузки объектов карты:', error);
      }
    };

    const loadRecentRoutes = () => {
      try {
        const stored = localStorage.getItem('recent_routes');
        if (stored) {
          setRecentRoutes(JSON.parse(stored));
        }
      } catch (error) {
        console.log('Ошибка загрузки истории маршрутов:', error);
      }
    };

    loadMapObjects();
    loadRecentRoutes();
  }, []);

  useEffect(() => {
    // Инициализация Яндекс.Карт с улучшенными всплывающими окнами
    const initializeMap = () => {
      if (window.ymaps && mapRef.current && !isMapLoaded) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map(mapRef.current, {
            center: currentLocation,
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
          });

          mapInstanceRef.current = map;
          setIsMapLoaded(true);

          // Добавляем постоянную точку "Вы здесь"
          const currentLocationPlacemark = new window.ymaps.Placemark(
            currentLocation,
            {
              balloonContent: createBalloonContent({
                name: '📍 Вы здесь',
                description: 'Ваше текущее местоположение',
                type: 'current'
              }),
              hintContent: '📍 Вы здесь'
            },
            {
              preset: 'islands#redHomeIcon',
              iconColor: '#e74c3c'
            }
          );

          currentLocationRef.current = currentLocationPlacemark;
          map.geoObjects.add(currentLocationPlacemark);

          // Добавление объектов на карту с улучшенными всплывающими окнами
          mapObjects.forEach(obj => {
            const placemark = new window.ymaps.Placemark(
              obj.coordinates,
              {
                balloonContent: createBalloonContent(obj),
                hintContent: obj.name
              },
              {
                preset: obj.customIcon ? null : getPresetByType(obj.type),
                iconColor: obj.iconColor || getColorByType(obj.type),
                iconImageHref: obj.customIcon || undefined,
                iconImageSize: obj.customIcon ? [32, 32] : undefined,
                iconImageOffset: obj.customIcon ? [-16, -16] : undefined
              }
            );

            placemark.events.add('click', () => {
              setSelectedObject(obj);
            });

            map.geoObjects.add(placemark);
          });
        });
      }
    };

    if (mapObjects.length > 0) {
      initializeMap();
    }
  }, [mapObjects, isMapLoaded]);

  const createBalloonContent = (obj: any) => {
    const photos = obj.photos && obj.photos.length > 0 
      ? obj.photos.map(photo => `<img src="${photo}" style="width: 100%; max-width: 200px; height: 120px; object-fit: cover; border-radius: 8px; margin: 5px 0;" />`).join('')
      : '';

    return `
      <div style="max-width: 320px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; border-radius: 12px 12px 0 0; margin: -10px -10px 10px -10px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${obj.name}</h3>
        </div>
        <div style="padding: 0 5px;">
          <p style="margin: 8px 0; color: #4b5563; line-height: 1.4;">${obj.description}</p>
          ${photos}
          ${obj.floor ? `<div style="margin: 6px 0; padding: 4px 8px; background: #f3f4f6; border-radius: 6px; display: inline-block;"><strong>Этаж:</strong> ${obj.floor}</div>` : ''}
          ${obj.capacity ? `<div style="margin: 6px 0; padding: 4px 8px; background: #f3f4f6; border-radius: 6px; display: inline-block;"><strong>Вместимость:</strong> ${obj.capacity}</div>` : ''}
          ${obj.workingHours ? `<div style="margin: 6px 0; padding: 4px 8px; background: #f3f4f6; border-radius: 6px; display: inline-block;"><strong>Режим работы:</strong> ${obj.workingHours}</div>` : ''}
          <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button onclick="window.setRouteFrom('${obj.id}')" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">Откуда</button>
            <button onclick="window.setRouteTo('${obj.id}')" style="flex: 1; background: #10b981; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">Куда</button>
            <button onclick="window.editObject('${obj.id}')" style="background: #f59e0b; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;">✏️</button>
          </div>
        </div>
      </div>
    `;
  };

  // Глобальные функции для использования в всплывающих окнах
  useEffect(() => {
    (window as any).setRouteFrom = (objId: string) => {
      const obj = mapObjects.find(o => o.id === objId);
      if (obj) setRouteFrom(obj);
    };
    
    (window as any).setRouteTo = (objId: string) => {
      const obj = mapObjects.find(o => o.id === objId);
      if (obj) setRouteTo(obj);
    };

    (window as any).editObject = (objId: string) => {
      const obj = mapObjects.find(o => o.id === objId);
      if (obj) {
        setEditingObject(obj);
        setIsEditDialogOpen(true);
      }
    };
  }, [mapObjects]);

  const getPresetByType = (type: string) => {
    const presets = {
      building: 'islands#blueHomeIcon',
      production: 'islands#redFactoryIcon',
      warehouse: 'islands#brownStorageIcon',
      cafeteria: 'islands#greenFoodIcon',
      parking: 'islands#grayCarIcon',
      office: 'islands#orangeIcon',
      security: 'islands#violetIcon'
    };
    return presets[type] || 'islands#blueIcon';
  };

  const getColorByType = (type: string) => {
    const colors = {
      building: '#0066CC',
      production: '#CC0000',
      warehouse: '#996633',
      cafeteria: '#00CC66',
      parking: '#666666',
      office: '#ff6b35',
      security: '#8b5cf6'
    };
    return colors[type] || '#0066CC';
  };

  const saveRecentRoute = (from: MapObject, to: MapObject) => {
    const route = {
      id: Date.now().toString(),
      from: from.name,
      to: to.name,
      timestamp: new Date().toISOString(),
      fromCoords: from.coordinates,
      toCoords: to.coordinates
    };
    
    const updatedRoutes = [route, ...recentRoutes.slice(0, 4)];
    setRecentRoutes(updatedRoutes);
    localStorage.setItem('recent_routes', JSON.stringify(updatedRoutes));
  };

  const generateRouteQR = async (from: MapObject, to: MapObject) => {
    try {
      const mapsUrl = `https://yandex.ru/maps/?rtext=${from.coordinates[0]},${from.coordinates[1]}~${to.coordinates[0]},${to.coordinates[1]}&rtt=pd`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(mapsUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      setRouteQRCode(qrCodeDataUrl);
      
      toast({
        title: "QR-код создан",
        description: "Отсканируйте QR-код чтобы открыть маршрут на смартфоне"
      });
    } catch (error) {
      console.error('Ошибка генерации QR-кода:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать QR-код",
        variant: "destructive"
      });
    }
  };

  const buildRoute = async () => {
    if (!routeFrom || !routeTo || !mapInstanceRef.current) {
      toast({
        title: "Ошибка построения маршрута",
        description: "Выберите начальную и конечную точки",
        variant: "destructive"
      });
      return;
    }

    // Удаляем предыдущий маршрут
    if (routeRef.current) {
      mapInstanceRef.current.geoObjects.remove(routeRef.current);
    }

    // Создаем новый маршрут
    const multiRoute = new window.ymaps.multiRouter.MultiRoute({
      referencePoints: [routeFrom.coordinates, routeTo.coordinates],
      params: {
        routingMode: 'pedestrian'
      }
    }, {
      boundsAutoApply: true,
      routeActiveStrokeWidth: 6,
      routeActiveStrokeColor: '#1e40af',
      routeStrokeWidth: 4,
      routeStrokeColor: '#3b82f6',
      wayPointStartIconColor: '#10b981',
      wayPointFinishIconColor: '#ef4444'
    });

    routeRef.current = multiRoute;
    mapInstanceRef.current.geoObjects.add(multiRoute);

    // Сохраняем в историю и генерируем QR-код
    saveRecentRoute(routeFrom, routeTo);
    await generateRouteQR(routeFrom, routeTo);

    toast({
      title: "Маршрут построен",
      description: `От "${routeFrom.name}" до "${routeTo.name}"`
    });
  };

  const clearRoute = () => {
    if (routeRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.geoObjects.remove(routeRef.current);
      routeRef.current = null;
    }
    setRouteFrom(null);
    setRouteTo(null);
    setRouteQRCode(null);
  };

  const downloadQRCode = () => {
    if (routeQRCode) {
      const link = document.createElement('a');
      link.download = 'route-qr-code.png';
      link.href = routeQRCode;
      link.click();
    }
  };

  const loadRecentRoute = (route: { from: string, to: string }) => {
    const fromObj = mapObjects.find(obj => obj.name === route.from);
    const toObj = mapObjects.find(obj => obj.name === route.to);
    
    if (fromObj && toObj) {
      setRouteFrom(fromObj);
      setRouteTo(toObj);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, objId: string) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const readers = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        const updatedObjects = mapObjects.map(obj => {
          if (obj.id === objId) {
            return {
              ...obj,
              photos: [...(obj.photos || []), ...results]
            };
          }
          return obj;
        });
        setMapObjects(updatedObjects);
        localStorage.setItem('map_objects', JSON.stringify(updatedObjects));
        
        toast({
          title: "Фотографии добавлены",
          description: `Добавлено ${results.length} фотографий`
        });
      });
    }
  };

  const updateObject = (updatedObj: MapObject) => {
    const updatedObjects = mapObjects.map(obj => 
      obj.id === updatedObj.id ? updatedObj : obj
    );
    setMapObjects(updatedObjects);
    localStorage.setItem('map_objects', JSON.stringify(updatedObjects));
    setIsEditDialogOpen(false);
    setEditingObject(null);
    
    // Перезагружаем карту для обновления иконок
    if (mapInstanceRef.current) {
      mapInstanceRef.current.geoObjects.removeAll();
      setIsMapLoaded(false);
    }
  };

  const getTypeStats = () => {
    const stats = { ...Object.fromEntries(objectTypes.map(t => [t.value, 0])) };
    mapObjects.forEach(obj => {
      stats[obj.type] = (stats[obj.type] || 0) + 1;
      stats.all += 1;
    });
    return stats;
  };

  const filteredObjects = mapObjects.filter(obj =>
    (activeFilter === 'all' || obj.type === activeFilter) &&
    (obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     obj.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = getTypeStats();

  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Боковая панель */}
        <div className="w-full lg:w-96 order-1 lg:order-1 space-y-4">
          {/* Поиск и фильтры */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Search className="w-5 h-5 text-blue-600" />
                <span>Поиск и фильтры</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск объектов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-blue-400 transition-colors"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {objectTypes.map(type => (
                  <Badge
                    key={type.value}
                    variant={activeFilter === type.value ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      activeFilter === type.value ? 'shadow-md' : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: activeFilter === type.value ? type.color : undefined,
                      borderColor: type.color
                    }}
                    onClick={() => setActiveFilter(type.value)}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label} ({stats[type.value] || 0})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Вкладки с функционалом */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <Tabs defaultValue="objects" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="objects" className="text-xs">Объекты</TabsTrigger>
                <TabsTrigger value="routes" className="text-xs">Маршруты</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">Статистика</TabsTrigger>
              </TabsList>

              <TabsContent value="objects" className="space-y-2 max-h-96 overflow-y-auto p-2">
                {filteredObjects.map(obj => (
                  <div
                    key={obj.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md transform hover:scale-[1.02] ${
                      selectedObject?.id === obj.id
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedObject(obj)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{obj.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{obj.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            style={{ borderColor: obj.iconColor || getColorByType(obj.type), color: obj.iconColor || getColorByType(obj.type) }}
                            className="text-xs"
                          >
                            <span className="mr-1">{objectTypes.find(t => t.value === obj.type)?.icon}</span>
                            {objectTypes.find(t => t.value === obj.type)?.label}
                          </Badge>
                          {obj.workingHours && (
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {obj.workingHours}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <AnimatedButton
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRouteFrom(obj);
                        }}
                        className="flex-1 text-xs"
                      >
                        Откуда
                      </AnimatedButton>
                      <AnimatedButton
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRouteTo(obj);
                        }}
                        className="flex-1 text-xs"
                      >
                        Куда
                      </AnimatedButton>
                      <AnimatedButton
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingObject(obj);
                          setIsEditDialogOpen(true);
                        }}
                        className="text-xs"
                      >
                        ✏️
                      </AnimatedButton>
                    </div>
                    
                    {/* Быстрая загрузка фото */}
                    <div className="mt-2">
                      <label className="flex items-center justify-center space-x-2 p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Добавить фото</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, obj.id)}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="routes" className="space-y-4 p-2">
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Откуда:</label>
                      <div className="p-2 bg-gray-50 rounded border text-sm">
                        {routeFrom ? routeFrom.name : 'Не выбрано'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Куда:</label>
                      <div className="p-2 bg-gray-50 rounded border text-sm">
                        {routeTo ? routeTo.name : 'Не выбрано'}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <AnimatedButton onClick={buildRoute} className="flex-1" disabled={!routeFrom || !routeTo}>
                      <NavigationIcon className="w-4 h-4 mr-2" />
                      Построить маршрут
                    </AnimatedButton>
                    <AnimatedButton onClick={clearRoute} variant="outline">
                      Очистить
                    </AnimatedButton>
                  </div>

                  {routeQRCode && (
                    <div className="text-center space-y-3 p-4 bg-gray-50 rounded-lg">
                      <img src={routeQRCode} alt="QR Code" className="mx-auto rounded" />
                      <AnimatedButton onClick={downloadQRCode} size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Скачать QR-код
                      </AnimatedButton>
                    </div>
                  )}

                  {recentRoutes.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Недавние маршруты
                      </h4>
                      {recentRoutes.map(route => (
                        <div 
                          key={route.id}
                          className="p-2 bg-white border rounded cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => loadRecentRoute(route)}
                        >
                          <div className="text-sm font-medium">{route.from} → {route.to}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(route.timestamp).toLocaleString('ru-RU')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4 p-2">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Статистика объектов
                  </h4>
                  {objectTypes.filter(t => t.value !== 'all').map(type => (
                    <div key={type.value} className="flex items-center justify-between p-2 bg-white border rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-sm">{type.label}</span>
                      </div>
                      <Badge variant="secondary">{stats[type.value] || 0}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Карта */}
        <div className="flex-1 order-2 lg:order-2">
          <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Интерактивная карта предприятия</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                ref={mapRef} 
                className="w-full h-[70vh] rounded-b-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {!isMapLoaded && (
                  <div className="text-white text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Загрузка карты...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Диалог редактирования объекта */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать объект</DialogTitle>
          </DialogHeader>
          {editingObject && (
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input
                  value={editingObject.name}
                  onChange={(e) => setEditingObject({...editingObject, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Описание</Label>
                <Input
                  value={editingObject.description}
                  onChange={(e) => setEditingObject({...editingObject, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Этаж</Label>
                  <Input
                    value={editingObject.floor || ''}
                    onChange={(e) => setEditingObject({...editingObject, floor: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Вместимость</Label>
                  <Input
                    value={editingObject.capacity || ''}
                    onChange={(e) => setEditingObject({...editingObject, capacity: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Режим работы</Label>
                <Input
                  value={editingObject.workingHours || ''}
                  onChange={(e) => setEditingObject({...editingObject, workingHours: e.target.value})}
                />
              </div>

              {/* Выбор иконки */}
              <div>
                <Label>Иконка</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {predefinedIcons.map(icon => (
                    <button
                      key={icon}
                      className={`p-2 text-xl border rounded hover:bg-gray-100 ${
                        editingObject.customIcon === icon ? 'bg-blue-100 border-blue-500' : ''
                      }`}
                      onClick={() => setEditingObject({...editingObject, customIcon: icon})}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <label className="flex items-center space-x-2 p-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Загрузить свою иконку</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setEditingObject({...editingObject, customIcon: e.target?.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Выбор цвета */}
              <div>
                <Label>Цвет иконки</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        editingObject.iconColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingObject({...editingObject, iconColor: color})}
                    />
                  ))}
                </div>
              </div>

              {/* Фотографии */}
              <div>
                <Label>Фотографии</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {editingObject.photos?.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Фото ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                        onClick={() => {
                          const newPhotos = editingObject.photos?.filter((_, i) => i !== index) || [];
                          setEditingObject({...editingObject, photos: newPhotos});
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400">
                    <Camera className="w-6 h-6 text-gray-400" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handlePhotoUpload(e, editingObject.id)}
                    />
                  </label>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <AnimatedButton
                  onClick={() => updateObject(editingObject)}
                  className="flex-1"
                >
                  Сохранить
                </AnimatedButton>
                <AnimatedButton
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1"
                >
                  Отмена
                </AnimatedButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapPage;
