
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Save, Upload, Palette } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface BrandingSettings {
  logoUrl: string;
  appName: string;
  welcomeMessage: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  font: string;
  iconColor: string;
}

const fontOptions = [
  { value: 'system-ui', label: 'Системный шрифт' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Verdana, sans-serif', label: 'Verdana' }
];

const AdminBranding = () => {
  const [settings, setSettings] = useState<BrandingSettings>({
    logoUrl: '',
    appName: 'Информационная система предприятия',
    welcomeMessage: 'Добро пожаловать',
    colors: {
      primary: '#0066cc',
      secondary: '#4f46e5',
      accent: '#10b981',
      background: '#f8fafc'
    },
    font: 'system-ui',
    iconColor: '#0066cc'
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('branding_settings');
      if (stored) {
        const loadedSettings = JSON.parse(stored);
        setSettings(loadedSettings);
        
        // Установка превью логотипа
        if (loadedSettings.logoUrl) {
          setLogoPreview(loadedSettings.logoUrl);
        }
      }
    } catch (error) {
      console.log('Ошибка загрузки настроек брендинга:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('branding_settings', JSON.stringify(settings));
      
      toast({
        title: "Успешно",
        description: "Настройки брендинга сохранены"
      });

      // В реальном приложении здесь были бы дополнительные действия
      // для применения настроек к интерфейсу
    } catch (error) {
      console.log('Ошибка сохранения настроек брендинга:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить настройки",
        variant: "destructive"
      });
    }
  };

  const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (colorName: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: value
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // В реальном приложении здесь был бы загрузка файла на сервер
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setSettings(prev => ({ ...prev, logoUrl: url }));
      
      toast({
        title: "Логотип загружен",
        description: "Логотип будет применен после сохранения настроек"
      });
    }
  };

  const ColorPicker = ({ name, label, value }: { name: string; label: string; value: string }) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: value }}
        ></div>
        <Input
          type="text"
          value={value}
          onChange={(e) => handleColorChange(name, e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
        <Input
          type="color"
          value={value}
          onChange={(e) => handleColorChange(name, e.target.value)}
          className="w-10 h-10 p-0 border-none"
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к панели администратора</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Настройки брендинга</h1>
          <Button 
            onClick={saveSettings}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить изменения</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Основные настройки */}
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название приложения</label>
                <Input
                  name="appName"
                  value={settings.appName}
                  onChange={handleBasicChange}
                  placeholder="Название системы"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Приветственное сообщение</label>
                <Textarea
                  name="welcomeMessage"
                  value={settings.welcomeMessage}
                  onChange={handleBasicChange}
                  placeholder="Текст приветствия на главной странице"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Шрифт</label>
                <select
                  name="font"
                  value={settings.font}
                  onChange={handleBasicChange}
                  className="w-full p-2 border rounded"
                >
                  {fontOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Логотип</label>
                <div className="flex items-center space-x-4">
                  {logoPreview ? (
                    <div className="w-16 h-16 bg-white rounded-full overflow-hidden border">
                      <img 
                        src={logoPreview} 
                        alt="Логотип" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">П</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                      className="flex items-center space-x-2 w-full"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Загрузить логотип</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Рекомендуемый размер: 512x512 пикселей, формат PNG с прозрачностью
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Настройки цветов */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Настройки цветовой схемы</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  name="primary"
                  label="Основной цвет"
                  value={settings.colors.primary}
                />
                
                <ColorPicker
                  name="secondary"
                  label="Дополнительный цвет"
                  value={settings.colors.secondary}
                />
                
                <ColorPicker
                  name="accent"
                  label="Акцентный цвет"
                  value={settings.colors.accent}
                />
                
                <ColorPicker
                  name="background"
                  label="Цвет фона"
                  value={settings.colors.background}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Цвет иконок</label>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded border"
                    style={{ backgroundColor: settings.iconColor }}
                  ></div>
                  <Input
                    type="text"
                    name="iconColor"
                    value={settings.iconColor}
                    onChange={handleBasicChange}
                    placeholder="#000000"
                    className="flex-1"
                  />
                  <Input
                    type="color"
                    value={settings.iconColor}
                    onChange={(e) => setSettings({ ...settings, iconColor: e.target.value })}
                    className="w-10 h-10 p-0 border-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Предпросмотр */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Предпросмотр</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="rounded-lg overflow-hidden border"
                style={{ backgroundColor: settings.colors.background }}
              >
                <div 
                  className="p-4 text-white"
                  style={{ backgroundColor: settings.colors.primary }}
                >
                  <div className="flex items-center space-x-3">
                    {logoPreview ? (
                      <div className="w-8 h-8 bg-white rounded-full overflow-hidden">
                        <img 
                          src={logoPreview} 
                          alt="Логотип" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span 
                          className="font-bold text-sm"
                          style={{ color: settings.colors.primary }}
                        >
                          П
                        </span>
                      </div>
                    )}
                    <span style={{ fontFamily: settings.font }}>
                      {settings.appName}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div 
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: settings.font }}
                  >
                    {settings.welcomeMessage}
                  </div>
                  <div 
                    className="p-2 rounded text-white mb-2"
                    style={{ backgroundColor: settings.colors.secondary }}
                  >
                    Раздел 1
                  </div>
                  <div 
                    className="p-2 rounded text-white"
                    style={{ backgroundColor: settings.colors.accent }}
                  >
                    Раздел 2
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Примечание</h4>
                <p className="text-gray-600">
                  В этом демо изменения визуального стиля показаны только в предпросмотре.
                  В полной версии приложения настройки будут применены ко всему интерфейсу.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBranding;
