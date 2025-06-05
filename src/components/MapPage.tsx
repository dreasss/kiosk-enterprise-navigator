
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Navigation as NavigationIcon, MapPin } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

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
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Загрузка объектов карты
    const loadMapObjects = () => {
      try {
        const stored = localStorage.getItem('map_objects');
        if (stored) {
          setMapObjects(JSON.parse(stored));
        } else {
          // Демо данные
          const demoObjects: MapObject[] = [
            {
              id: '1',
              name: 'Главное здание',
              description: 'Административное здание предприятия',
              coordinates: [55.7558, 37.6173],
              type: 'building',
              floor: '1-5'
            },
            {
              id: '2',
              name: 'Производственный цех №1',
              description: 'Основное производство',
              coordinates: [55.7568, 37.6183],
              type: 'production',
              floor: '1'
            },
            {
              id: '3',
              name: 'Склад',
              description: 'Складские помещения',
              coordinates: [55.7548, 37.6163],
              type: 'warehouse',
              floor: '1'
            },
            {
              id: '4',
              name: 'Столовая',
              description: 'Место питания сотрудников',
              coordinates: [55.7563, 37.6178],
              type: 'cafeteria',
              floor: '1'
            },
            {
              id: '5',
              name: 'Парковка',
              description: 'Парковочные места',
              coordinates: [55.7553, 37.6168],
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
            center: [55.7558, 37.6173],
            zoom: 16,
            controls: ['zoomControl', 'fullscreenControl']
          });

          mapInstanceRef.current = map;
          setIsMapLoaded(true);

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

  const buildRoute = () => {
    if (!routeFrom || !routeTo || !mapInstanceRef.current) {
      toast({
        title: "Ошибка построения маршрута",
        description: "Выберите начальную и конечную точки",
        variant: "destructive"
      });
      return;
    }

    const multiRoute = new window.ymaps.multiRouter.MultiRoute({
      referencePoints: [routeFrom.coordinates, routeTo.coordinates],
      params: {
        routingMode: 'pedestrian'
      }
    });

    mapInstanceRef.current.geoObjects.removeAll();
    mapInstanceRef.current.geoObjects.add(multiRoute);

    // Повторно добавляем метки
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

      mapInstanceRef.current.geoObjects.add(placemark);
    });

    toast({
      title: "Маршрут построен",
      description: `От "${routeFrom.name}" до "${routeTo.name}"`
    });
  };

  const clearRoute = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.geoObjects.removeAll();
      
      // Повторно добавляем только метки
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

        mapInstanceRef.current.geoObjects.add(placemark);
      });
    }
    setRouteFrom(null);
    setRouteTo(null);
  };

  const filteredObjects = mapObjects.filter(obj =>
    obj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 h-full">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Карта */}
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Интерактивная карта предприятия</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <div
                ref={mapRef}
                className="w-full h-full rounded-lg border"
                style={{ minHeight: '500px' }}
              >
                {!isMapLoaded && (
                  <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Загрузка карты...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Поиск */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Поиск объектов</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Введите название объекта..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors"
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <NavigationIcon className="w-5 h-5" />
                <span>Построение маршрута</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Откуда:</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
                  value={routeFrom?.id || ''}
                  onChange={(e) => {
                    const obj = mapObjects.find(o => o.id === e.target.value);
                    setRouteFrom(obj || null);
                  }}
                >
                  <option value="">Выберите начальную точку</option>
                  {mapObjects.map((obj) => (
                    <option key={obj.id} value={obj.id}>
                      {obj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Куда:</label>
                <select
                  className="w-full mt-1 p-2 border rounded"
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
                <Button onClick={buildRoute} className="flex-1">
                  Построить маршрут
                </Button>
                <Button onClick={clearRoute} variant="outline" className="flex-1">
                  Очистить
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Информация о выбранном объекте */}
          {selectedObject && (
            <Card>
              <CardHeader>
                <CardTitle>Информация об объекте</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-bold text-lg mb-2">{selectedObject.name}</h3>
                <p className="text-gray-600 mb-2">{selectedObject.description}</p>
                {selectedObject.floor && (
                  <p className="text-sm text-gray-500">Этаж: {selectedObject.floor}</p>
                )}
                <div className="mt-4 space-y-2">
                  <Button
                    onClick={() => setRouteFrom(selectedObject)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Использовать как начальную точку
                  </Button>
                  <Button
                    onClick={() => setRouteTo(selectedObject)}
                    variant="outline"
                    size="sm"
                    className="w-full"
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
