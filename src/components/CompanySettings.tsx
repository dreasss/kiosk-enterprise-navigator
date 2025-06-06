
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Building, Upload, Palette } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface CompanyInfo {
  name: string;
  description: string;
  logo: string;
}

const CompanySettings = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'ООО "Инновационные Технологии"',
    description: 'Современная производственная система',
    logo: '🏭'
  });
  const { toast } = useToast();

  const predefinedLogos = ['🏭', '🏢', '🏪', '🏬', '🏛️', '🏗️', '🏘️', '🌐', '⚡', '🔧', '⚙️', '🎯'];

  useEffect(() => {
    const stored = localStorage.getItem('company_info');
    if (stored) {
      setCompanyInfo(JSON.parse(stored));
    }
  }, []);

  const saveCompanyInfo = () => {
    localStorage.setItem('company_info', JSON.stringify(companyInfo));
    
    // Отправляем событие для обновления навигации
    window.dispatchEvent(new CustomEvent('companyInfoUpdated', { detail: companyInfo }));
    
    toast({
      title: "Настройки сохранены",
      description: "Информация о предприятии обновлена"
    });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyInfo({
          ...companyInfo,
          logo: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="w-5 h-5 text-blue-600" />
          <span>Настройки предприятия</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="company-name">Название предприятия</Label>
          <Input
            id="company-name"
            value={companyInfo.name}
            onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
            placeholder="Введите название предприятия"
          />
        </div>

        <div>
          <Label htmlFor="company-description">Описание</Label>
          <Textarea
            id="company-description"
            value={companyInfo.description}
            onChange={(e) => setCompanyInfo({...companyInfo, description: e.target.value})}
            placeholder="Краткое описание деятельности"
            rows={2}
          />
        </div>

        <div>
          <Label>Логотип</Label>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                {typeof companyInfo.logo === 'string' && companyInfo.logo.startsWith('data:') ? (
                  <img src={companyInfo.logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <span className="text-3xl">{companyInfo.logo}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Предпросмотр логотипа</p>
                <label className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Загрузить изображение</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Или выберите готовую иконку:</p>
              <div className="grid grid-cols-6 gap-2">
                {predefinedLogos.map(logo => (
                  <button
                    key={logo}
                    className={`p-3 text-2xl border rounded-lg hover:bg-gray-100 transition-colors ${
                      companyInfo.logo === logo ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
                    }`}
                    onClick={() => setCompanyInfo({...companyInfo, logo})}
                  >
                    {logo}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button onClick={saveCompanyInfo} className="w-full">
          <Palette className="w-4 h-4 mr-2" />
          Сохранить настройки
        </Button>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;
