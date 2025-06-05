
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Navigation as NavigationIcon, MapPin, QrCode, Download } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import QRCode from 'qrcode';

interface MapObject {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: string;
  floor?: string;
}

const MapPage = () => {
  const [mapObjects, setMapObjects] = useState<MapObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<MapObject | null>(null);
  const [routeFrom, setRouteFrom] = useState<MapObject | null>(null);
  const [routeTo, setRouteTo] = useState<MapObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [routeQRCode, setRouteQRCode] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const currentLocationRef = useRef<any>(null);
  const routeRef = useRef<any>(null);
  const { toast } = useToast();

  // Координаты постоянной точки "Вы здесь"
  const currentLocation: [number, number] = [56.742252, 37.191930];

  useEffect(() => {
    // Загрузка объектов карты
    const loadMapObjects = () => {
      try {
        const stored = localStorage.getItem('map_objects');
        if (stored) {
          setMapObjects(JSON.parse(stored));
        } else {
          // Демо данные с обновленными координатами рядом с текущей позицией
          const demoObjects: MapObject[] = [
            {
              id: '1',
              name: 'Главное здание',
              description: 'Административное здание предприятия',
              coordinates: [56.742352, 37.192030],
              type: 'building',
              floor: '1-5'
            },
            {
              id: '2',
              name: 'Производственный цех №1',
              description: 'Основное производство',
              coordinates: [56.742452, 37.192130],
              type: 'production',
              floor: '1'
            },
            {
              id: '3',
              name: 'Склад',
              description: 'Складские помещения',
              coordinates: [56.742152, 37.191830],
              type: 'warehouse',
              floor: '1'
            },
            {
              id: '4',
              name: 'Столовая',
              description: 'Место питания сотрудников',
              coordinates: [56.742302, 37.192080],
              type: 'cafeteria',
              floor: '1'
            },
            {
              id: '5',
              name: 'Парковка',
              description: 'Парковочные места',
              coordinates: [56.742202, 37.191780],
              type: 'parking',
              floor: '0'
            }
          ];
          setMapObjects(demoObjects);
          localStorage.setItem('map_objects', JSON.stringify(demoObjects));
        }
      } catch (error) {
        console.log('Ошибка загрузки объектов карты:', error);
      }
    };

    loadMapObjects();
  }, []);

  useEffect(() => {
    // Инициализация Яндекс.Карт
    const initializeMap = () => {
      if (window.ymaps && mapRef.current && !isMapLoaded) {
        window.ymaps.ready(() => {
          const map = new window.ymaps.Map(mapRef.current, {
            center: currentLocation, // Центрируем на "Вы здесь"
            zoom: 17,
            controls: ['zoomControl', 'fullscreenControl']
          });

          mapInstanceRef.current = map;
          setIsMapLoaded(true);

          // Добавляем постоянную точку "Вы здесь"
          const currentLocationPlacemark = new window.ymaps.Placemark(
            currentLocation,
            {
              balloonContent: `
                <div style="text-align: center;">
                  <h3 style="color: #e74c3c; margin: 0;">📍 Вы здесь</h3>
                  <p style="margin: 5px 0;">Ваше текущее местоположение</p>
                </div>
              `,
              hintContent: '📍 Вы здесь'
            },
            {
              preset: 'islands#redHomeIcon',
              iconColor: '#e74c3c'
            }
          );

          currentLocationRef.current = currentLocationPlacemark;
          map.geoObjects.add(currentLocationPlacemark);

          // Добавление объектов на карту
          mapObjects.forEach(obj => {
            const placemark = new window.ymaps.Placemark(
              obj.coordinates,
              {
                balloonContent: `
                  <div>
                    <h3>${obj.name}</h3>
                    <p>${obj.description}</p>
                    ${obj.floor ? `<p>Этаж: ${obj.floor}</p>` : ''}
                  </div>
                `,
                hintContent: obj.name
              },
              {
                preset: getPresetByType(obj.type),
                iconColor: getColorByType(obj.type)
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

  const getPresetByType = (type: string) => {
    const presets = {
      building: 'islands#blueHomeIcon',
      production: 'islands#redFactoryIcon',
      warehouse: 'islands#brownStorageIcon',
      cafeteria: 'islands#greenFoodIcon',
      parking: 'islands#grayCarIcon'
    };
    return presets[type] || 'islands#blueIcon';
  };

  const getColorByType = (type: string) => {
    const colors = {
      building: '#0066CC',
      production: '#CC0000',
      warehouse: '#996633',
      cafeteria: '#00CC66',
      parking: '#666666'
    };
    return colors[type] || '#0066CC';
  };

  const generateRouteQR = async (from: MapObject, to: MapObject) => {
    try {
      // Создаем URL для открытия маршрута в картах
      const mapsUrl = `https://yandex.ru/maps/?rtext=${from.coordinates[0]},${from.coordinates[1]}~${to.coordinates[0]},${to.coordinates[1]}&rtt=pd`;
      
      // Генерируем QR-код
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

    // Генерируем QR-код для маршрута
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

  const filteredObjects = mapObjects.filter(obj =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-6 min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Карта */}
        <div className="flex-1 order-2 lg:order-1">
          <Card className="h-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-xl">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>Интерактивная карта предприятия</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)]">
              <div
                ref={mapRef}
                className="w-full h-full rounded-xl border shadow-inner"
                style={{ minHeight: '400px' }}
              >
                {!isMapLoaded && (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Загрузка карты...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="w-full lg:w-80 space-y-4 order-1 lg:order-2">
          {/* Поиск */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Search className="w-5 h-5 text-blue-600" />
                <span>Поиск объектов</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Введите название объекта..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4 h-12 text-base touch-manipulation"
              />
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 touch-manipulation"
                    onClick={() => setSelectedObject(obj)}
                  >
                    <div className="font-medium">{obj.name}</div>
                    <div className="text-sm text-gray-600">{obj.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Построение маршрута */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <NavigationIcon className="w-5 h-5 text-blue-600" />
                <span>Построение маршрута</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Откуда:</label>
                <select
                  className="w-full p-3 border rounded-lg text-base touch-manipulation bg-white"
                  value={routeFrom?.id || ''}
                  onChange={(e) => {
                    const obj = mapObjects.find(o => o.id === e.target.value);
                    setRouteFrom(obj || null);
                  }}
                >
                  <option value="">Выберите начальную точку</option>
                  <option value="current">📍 Вы здесь</option>
                  {mapObjects.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Куда:</label>
                <select
                  className="w-full p-3 border rounded-lg text-base touch-manipulation bg-white"
                  value={routeTo?.id || ''}
                  onChange={(e) => {
                    const obj = mapObjects.find(o => o.id === e.target.value);
                    setRouteTo(obj || null);
                  }}
                >
                  <option value="">Выберите конечную точку</option>
                  {mapObjects.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={buildRoute} 
                  className="flex-1 h-12 text-base touch-manipulation transform hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  Построить маршрут
                </Button>
                <Button 
                  onClick={clearRoute} 
                  variant="outline" 
                  className="flex-1 h-12 text-base touch-manipulation transform hover:scale-105 active:scale-95 transition-transform duration-200"
                >
                  Очистить
                </Button>
              </div>

              {/* QR-код маршрута */}
              {routeQRCode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <QrCode className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">QR-код маршрута</span>
                  </div>
                  <img src={routeQRCode} alt="QR-код маршрута" className="mx-auto mb-3 rounded-lg shadow-sm" />
                  <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    size="sm"
                    className="touch-manipulation transform hover:scale-105 active:scale-95 transition-transform duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Скачать QR-код
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Информация о выбранном объекте */}
          {selectedObject && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Информация об объекте</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-2">{selectedObject.name}</h3>
                <p className="text-gray-600 mb-2">{selectedObject.description}</p>
                {selectedObject.floor && (
                  <p className="text-sm text-gray-500 mb-4">Этаж: {selectedObject.floor}</p>
                )}
                <div className="space-y-2">
                  <Button
                    onClick={() => setRouteFrom(selectedObject)}
                    variant="outline"
                    size="sm"
                    className="w-full h-10 touch-manipulation transform hover:scale-105 active:scale-95 transition-transform duration-200"
                  >
                    Использовать как начальную точку
                  </Button>
                  <Button
                    onClick={() => setRouteTo(selectedObject)}
                    variant="outline"
                    size="sm"
                    className="w-full h-10 touch-manipulation transform hover:scale-105 active:scale-95 transition-transform duration-200"
                  >
                    Использовать как конечную точку
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
