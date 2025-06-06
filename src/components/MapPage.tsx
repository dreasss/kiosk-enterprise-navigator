import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Navigation as NavigationIcon, MapPin, QrCode, Download, Filter, BarChart3, Clock, Route, Upload, Camera, Palette, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useIdleRedirect } from '../hooks/useIdleRedirect';
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

interface RouteInfo {
  distance: string;
  duration: string;
  qrCode: string;
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
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const { toast } = useToast();

  // Используем хук для автоматического редиректа
  useIdleRedirect();

  // Координаты киоска (новое местоположение по умолчанию)
  const kioskLocation: [number, number] = [56.742292, 37.191953];

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
    const initializeMap = () => {
      if (window.ymaps && mapRef.current && !isMapLoaded) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map(mapRef.current, {
            center: kioskLocation,
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
          });

          mapInstanceRef.current = map;
          setIsMapLoaded(true);

          // Добавляем киоск "Вы здесь" со стрелкой
          const kioskPlacemark = new window.ymaps.Placemark(
            kioskLocation,
            {
              balloonContent: createBalloonContent({
                name: '📍 Информационный киоск',
                description: 'Вы находитесь здесь',
                type: 'kiosk'
              }),
              hintContent: '📍 Вы здесь'
            },
            {
              preset: 'islands#redDirectionIcon',
              iconColor: '#e74c3c'
            }
          );

          currentLocationRef.current = kioskPlacemark;
          map.geoObjects.add(kioskPlacemark);

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
              map.balloon.close();
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
          ${obj.type !== 'kiosk' ? `<div style="margin-top: 12px;"><button onclick="window.buildRouteToObject('${obj.id}')" style="width: 100%; background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">🗺️ Маршрут</button></div>` : ''}
        </div>
      </div>
    `;
  };

  // Глобальная функция для построения маршрута из всплывающего окна
  useEffect(() => {
    (window as any).buildRouteToObject = async (objId: string) => {
      const obj = mapObjects.find(o => o.id === objId);
      if (obj && mapInstanceRef.current) {
        // Закрываем всплывающее окно
        mapInstanceRef.current.balloon.close();
        
        // Строим маршрут от киоска к объекту
        await buildRouteFromKiosk(obj);
      }
    };
  }, [mapObjects]);

  const buildRouteFromKiosk = async (targetObject: MapObject) => {
    if (!mapInstanceRef.current) return;

    // Удаляем предыдущий маршрут
    if (routeRef.current) {
      mapInstanceRef.current.geoObjects.remove(routeRef.current);
    }

    // Создаем новый маршрут с анимацией
    const multiRoute = new window.ymaps.multiRouter.MultiRoute({
      referencePoints: [kioskLocation, targetObject.coordinates],
      params: {
        routingMode: 'pedestrian'
      }
    }, {
      boundsAutoApply: true,
      routeActiveStrokeWidth: 8,
      routeActiveStrokeColor: '#3b82f6',
      routeStrokeWidth: 6,
      routeStrokeColor: '#60a5fa',
      wayPointStartIconColor: '#e74c3c',
      wayPointFinishIconColor: '#10b981',
      opacity: 0.9
    });

    routeRef.current = multiRoute;

    // Добавляем маршрут с анимацией появления
    multiRoute.events.add('requestsuccess', async () => {
      const routes = multiRoute.getRoutes();
      if (routes.get(0)) {
        const route = routes.get(0);
        const distance = route.properties.get('distance');
        const duration = route.properties.get('duration');
        
        // Создаем информацию о маршруте
        const routeData = {
          distance: distance ? Math.round(distance.value / 1000 * 100) / 100 + ' км' : 'Неизвестно',
          duration: duration ? Math.round(duration.value / 60) + ' мин' : 'Неизвестно',
          qrCode: await generateRouteQR(kioskLocation, targetObject.coordinates)
        };
        
        setRouteInfo(routeData);
        setShowRouteModal(true);
      }
    });

    mapInstanceRef.current.geoObjects.add(multiRoute);

    toast({
      title: "Маршрут построен",
      description: `Путь к "${targetObject.name}"`
    });
  };

  const generateRouteQR = async (from: [number, number], to: [number, number]) => {
    try {
      const mapsUrl = `https://yandex.ru/maps/?rtext=${from[0]},${from[1]}~${to[0]},${to[1]}&rtt=pd`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(mapsUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Ошибка генерации QR-кода:', error);
      return '';
    }
  };

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

  const clearRoute = () => {
    if (routeRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.geoObjects.remove(routeRef.current);
      routeRef.current = null;
    }
    setRouteInfo(null);
    setShowRouteModal(false);
  };

  const downloadQRCode = () => {
    if (routeInfo?.qrCode) {
      const link = document.createElement('a');
      link.download = 'route-qr-code.png';
      link.href = routeInfo.qrCode;
      link.click();
    }
  };

  const filteredObjects = mapObjects.filter(obj =>
    (activeFilter === 'all' || obj.type === activeFilter) &&
    (obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     obj.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeStats = () => {
    const stats = { ...Object.fromEntries(objectTypes.map(t => [t.value, 0])) };
    mapObjects.forEach(obj => {
      stats[obj.type] = (stats[obj.type] || 0) + 1;
      stats.all += 1;
    });
    return stats;
  };

  const stats = getTypeStats();

  return (
    <div className="p-2 lg:p-4 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        {/* Боковая панель - адаптирована для сенсорного управления */}
        <div className="w-full lg:w-80 order-1 lg:order-1 space-y-3">
          {/* Поиск и фильтры */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Search className="w-5 h-5 text-blue-600" />
                <span>Поиск объектов</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Найти объект..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-400 transition-colors rounded-xl"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {objectTypes.map(type => (
                  <Badge
                    key={type.value}
                    variant={activeFilter === type.value ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 p-3 text-sm font-medium ${
                      activeFilter === type.value ? 'shadow-lg' : 'hover:shadow-sm'
                    }`}
                    style={{
                      backgroundColor: activeFilter === type.value ? type.color : undefined,
                      borderColor: type.color
                    }}
                    onClick={() => setActiveFilter(type.value)}
                  >
                    <span className="mr-2 text-lg">{type.icon}</span>
                    <div className="flex flex-col">
                      <span>{type.label}</span>
                      <span className="text-xs opacity-75">({stats[type.value] || 0})</span>
                    </div>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Список объектов - увеличенные элементы для сенсорного управления */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Объекты предприятия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredObjects.map(obj => (
                <div
                  key={obj.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] ${
                    selectedObject?.id === obj.id
                      ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedObject(obj)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">{obj.name}</h4>
                      <p className="text-gray-600 mb-3">{obj.description}</p>
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge 
                          variant="outline" 
                          style={{ borderColor: obj.iconColor || getColorByType(obj.type), color: obj.iconColor || getColorByType(obj.type) }}
                          className="text-sm"
                        >
                          <span className="mr-1 text-lg">{objectTypes.find(t => t.value === obj.type)?.icon}</span>
                          {objectTypes.find(t => t.value === obj.type)?.label}
                        </Badge>
                        {obj.workingHours && (
                          <Badge variant="secondary" className="text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {obj.workingHours}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <AnimatedButton
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      buildRouteFromKiosk(obj);
                    }}
                    className="w-full h-14 text-lg font-semibold"
                  >
                    <Route className="w-5 h-5 mr-2" />
                    Построить маршрут
                  </AnimatedButton>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Карта */}
        <div className="flex-1 order-2 lg:order-2">
          <Card className="h-full shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Интерактивная карта предприятия</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div 
                ref={mapRef} 
                className="w-full h-[75vh] rounded-b-lg"
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
                    <p className="text-lg">Загрузка карты...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Модальное окно с информацией о маршруте */}
      <Dialog open={showRouteModal} onOpenChange={setShowRouteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Route className="w-6 h-6 text-blue-600" />
              <span>Информация о маршруте</span>
            </DialogTitle>
          </DialogHeader>
          {routeInfo && (
            <div className="space-y-6 text-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{routeInfo.distance}</div>
                  <div className="text-sm text-gray-600">Расстояние</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{routeInfo.duration}</div>
                  <div className="text-sm text-gray-600">Время пути</div>
                </div>
              </div>
              
              {routeInfo.qrCode && (
                <div className="space-y-3">
                  <p className="text-gray-700">Отсканируйте QR-код для открытия маршрута на смартфоне:</p>
                  <div className="flex justify-center">
                    <img src={routeInfo.qrCode} alt="QR Code" className="rounded-lg shadow-md" />
                  </div>
                  <AnimatedButton onClick={downloadQRCode} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Скачать QR-код
                  </AnimatedButton>
                </div>
              )}
              
              <div className="flex space-x-3">
                <AnimatedButton onClick={clearRoute} variant="outline" className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Закрыть маршрут
                </AnimatedButton>
                <AnimatedButton onClick={() => setShowRouteModal(false)} className="flex-1">
                  Понятно
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
