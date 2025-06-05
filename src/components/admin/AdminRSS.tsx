
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { ArrowLeft, RefreshCcw, Rss, Save } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface RssSettings {
  enabled: boolean;
  url: string;
  title: string;
  updateInterval: number;
  maxItems: number;
  showOnMarquee: boolean;
}

const AdminRSS = () => {
  const [settings, setSettings] = useState<RssSettings>({
    enabled: false,
    url: '',
    title: '',
    updateInterval: 30,
    maxItems: 10,
    showOnMarquee: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('rss_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
      
      const lastUpdateTime = localStorage.getItem('rss_last_update');
      if (lastUpdateTime) {
        setLastUpdate(lastUpdateTime);
      }
    } catch (error) {
      console.log('Ошибка загрузки настроек RSS:', error);
    }
  };

  const saveSettings = () => {
    try {
      if (settings.enabled && !settings.url) {
        toast({
          title: "Ошибка",
          description: "URL источника RSS не может быть пустым",
          variant: "destructive"
        });
        return;
      }
      
      localStorage.setItem('rss_settings', JSON.stringify(settings));
      toast({
        title: "Успешно",
        description: "Настройки RSS сохранены"
      });
    } catch (error) {
      console.log('Ошибка сохранения настроек RSS:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFeed = () => {
    if (!settings.url) {
      toast({
        title: "Ошибка",
        description: "URL источника RSS не указан",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // В реальном приложении здесь был бы запрос к RSS-ленте
    setTimeout(() => {
      // Эмуляция загрузки новостей из RSS
      const demoRssNews = [
        {
          id: 'rss1',
          title: 'Новые технологии в промышленности',
          description: 'Обзор последних технологических решений для промышленных предприятий',
          content: 'Краткое описание новостей из внешних источников...',
          date: new Date().toISOString(),
          source: 'Промышленный вестник',
          isExternal: true,
          url: 'https://example.com/news1'
        },
        {
          id: 'rss2',
          title: 'Изменения в отраслевом законодательстве',
          description: 'Важные изменения в нормативно-правовой базе',
          content: 'Краткое описание новостей из внешних источников...',
          date: new Date(Date.now() - 43200000).toISOString(),
          source: 'Правовой навигатор',
          isExternal: true,
          url: 'https://example.com/news2'
        },
        {
          id: 'rss3',
          title: 'Энергосбережение на производстве',
          description: 'Новые методы снижения энергопотребления',
          content: 'Краткое описание новостей из внешних источников...',
          date: new Date(Date.now() - 86400000).toISOString(),
          source: 'Энергетический журнал',
          isExternal: true,
          url: 'https://example.com/news3'
        }
      ];

      localStorage.setItem('rss_news', JSON.stringify(demoRssNews));
      
      const now = new Date().toISOString();
      localStorage.setItem('rss_last_update', now);
      setLastUpdate(now);
      
      setIsLoading(false);
      
      toast({
        title: "Успешно",
        description: "RSS-лента обновлена"
      });
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к панели администратора</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Настройка RSS</h1>
        <p className="text-gray-600">Управление внешними RSS-лентами и бегущей строкой</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rss className="w-5 h-5" />
                <span>Настройки RSS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-lg font-medium">Включить RSS</label>
                  <p className="text-sm text-gray-500">Активировать загрузку новостей из внешних источников</p>
                </div>
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL источника RSS *</label>
                <Input
                  value={settings.url}
                  onChange={(e) => setSettings({ ...settings, url: e.target.value })}
                  placeholder="https://example.com/rss"
                  disabled={!settings.enabled}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Укажите полный URL RSS-ленты, включая http:// или https://
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Заголовок</label>
                <Input
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  placeholder="Новости отрасли"
                  disabled={!settings.enabled}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Интервал обновления (минуты)
                  </label>
                  <Input
                    type="number"
                    min="5"
                    max="1440"
                    value={settings.updateInterval}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      updateInterval: parseInt(e.target.value) || 30 
                    })}
                    disabled={!settings.enabled}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Максимальное количество новостей
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.maxItems}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      maxItems: parseInt(e.target.value) || 10 
                    })}
                    disabled={!settings.enabled}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-lg font-medium">Показывать в бегущей строке</label>
                  <p className="text-sm text-gray-500">
                    Включить отображение RSS новостей в бегущей строке на главной странице
                  </p>
                </div>
                <Switch
                  checked={settings.showOnMarquee}
                  onCheckedChange={(checked) => setSettings({ ...settings, showOnMarquee: checked })}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="pt-4 flex space-x-4">
                <Button 
                  onClick={saveSettings}
                  className="flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить настройки</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleUpdateFeed}
                  disabled={isLoading || !settings.enabled || !settings.url}
                  className="flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                      <span>Обновление...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-4 h-4" />
                      <span>Обновить ленту сейчас</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Информационная панель */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Статус RSS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Статус:</h4>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${settings.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>{settings.enabled ? 'Активно' : 'Отключено'}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-1">Последнее обновление:</h4>
                <p>
                  {lastUpdate ? (
                    new Date(lastUpdate).toLocaleString('ru-RU')
                  ) : (
                    'Никогда'
                  )}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-blue-800 mb-2">Справка</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• RSS (Really Simple Syndication) - формат для получения обновлений с сайтов</li>
                  <li>• Используйте URL, оканчивающийся на .xml или /rss</li>
                  <li>• Обновление по расписанию происходит только когда приложение активно</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-yellow-800 mb-1">Примечание</h4>
                <p className="text-yellow-700">
                  В демо-режиме будут загружены тестовые данные вместо реального RSS потока.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminRSS;
