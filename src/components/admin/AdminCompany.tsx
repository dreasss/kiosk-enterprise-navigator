
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface CompanyInfo {
  name: string;
  description: string;
  founded: string;
  employees: string;
  address: string;
  mission: string;
  vision: string;
  values: string[];
  achievements: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  contacts: {
    phone: string;
    email: string;
    website: string;
  };
}

const AdminCompany = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    description: '',
    founded: '',
    employees: '',
    address: '',
    mission: '',
    vision: '',
    values: [''],
    achievements: [
      { year: '', title: '', description: '' }
    ],
    contacts: {
      phone: '',
      email: '',
      website: ''
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = () => {
    try {
      const stored = localStorage.getItem('company_info');
      if (stored) {
        setCompanyInfo(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Ошибка загрузки информации о компании:', error);
    }
  };

  const saveCompanyInfo = () => {
    try {
      // Валидация
      if (!companyInfo.name) {
        toast({
          title: "Ошибка",
          description: "Название предприятия обязательно",
          variant: "destructive"
        });
        return;
      }

      // Очистка от пустых значений
      const cleanedValues = companyInfo.values.filter(v => v.trim());
      const cleanedAchievements = companyInfo.achievements.filter(
        a => a.year.trim() && a.title.trim()
      );

      const cleanedInfo = {
        ...companyInfo,
        values: cleanedValues.length ? cleanedValues : [''],
        achievements: cleanedAchievements.length ? cleanedAchievements : [{ year: '', title: '', description: '' }]
      };

      localStorage.setItem('company_info', JSON.stringify(cleanedInfo));
      setCompanyInfo(cleanedInfo);
      
      toast({
        title: "Успешно",
        description: "Информация о предприятии сохранена"
      });
    } catch (error) {
      console.log('Ошибка сохранения информации о компании:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить информацию",
        variant: "destructive"
      });
    }
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [name]: value
      }
    }));
  };

  const handleValueChange = (index: number, value: string) => {
    const updatedValues = [...companyInfo.values];
    updatedValues[index] = value;
    setCompanyInfo(prev => ({
      ...prev,
      values: updatedValues
    }));
  };

  const addValue = () => {
    setCompanyInfo(prev => ({
      ...prev,
      values: [...prev.values, '']
    }));
  };

  const removeValue = (index: number) => {
    if (companyInfo.values.length <= 1) return;
    const updatedValues = companyInfo.values.filter((_, i) => i !== index);
    setCompanyInfo(prev => ({
      ...prev,
      values: updatedValues
    }));
  };

  const handleAchievementChange = (index: number, field: string, value: string) => {
    const updatedAchievements = [...companyInfo.achievements];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value
    };
    setCompanyInfo(prev => ({
      ...prev,
      achievements: updatedAchievements
    }));
  };

  const addAchievement = () => {
    setCompanyInfo(prev => ({
      ...prev,
      achievements: [...prev.achievements, { year: '', title: '', description: '' }]
    }));
  };

  const removeAchievement = (index: number) => {
    if (companyInfo.achievements.length <= 1) return;
    const updatedAchievements = companyInfo.achievements.filter((_, i) => i !== index);
    setCompanyInfo(prev => ({
      ...prev,
      achievements: updatedAchievements
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Назад к панели администратора</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">О предприятии</h1>
          <Button 
            onClick={saveCompanyInfo}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить изменения</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Название предприятия *</label>
              <Input
                name="name"
                value={companyInfo.name}
                onChange={handleBasicInfoChange}
                placeholder="ООО 'Компания'"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Описание</label>
              <Textarea
                name="description"
                value={companyInfo.description}
                onChange={handleBasicInfoChange}
                placeholder="Общее описание предприятия..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Год основания</label>
                <Input
                  name="founded"
                  value={companyInfo.founded}
                  onChange={handleBasicInfoChange}
                  placeholder="2000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Количество сотрудников</label>
                <Input
                  name="employees"
                  value={companyInfo.employees}
                  onChange={handleBasicInfoChange}
                  placeholder="1000+"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Адрес</label>
                <Input
                  name="address"
                  value={companyInfo.address}
                  onChange={handleBasicInfoChange}
                  placeholder="г. Москва, ул. Промышленная, 1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Миссия и видение */}
        <Card>
          <CardHeader>
            <CardTitle>Миссия и видение</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Миссия компании</label>
              <Textarea
                name="mission"
                value={companyInfo.mission}
                onChange={handleBasicInfoChange}
                placeholder="Миссия предприятия..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Видение</label>
              <Textarea
                name="vision"
                value={companyInfo.vision}
                onChange={handleBasicInfoChange}
                placeholder="Видение будущего..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Ценности */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ценности</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addValue}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {companyInfo.values.map((value, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={`Ценность ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeValue(index)}
                  disabled={companyInfo.values.length <= 1}
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Достижения */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Достижения</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addAchievement}
                className="flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {companyInfo.achievements.map((achievement, index) => (
              <div key={index} className="space-y-3 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Достижение {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(index)}
                    disabled={companyInfo.achievements.length <= 1}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    <span>Удалить</span>
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-2">Год</label>
                    <Input
                      value={achievement.year}
                      onChange={(e) => handleAchievementChange(index, 'year', e.target.value)}
                      placeholder="2023"
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium mb-2">Заголовок</label>
                    <Input
                      value={achievement.title}
                      onChange={(e) => handleAchievementChange(index, 'title', e.target.value)}
                      placeholder="Название достижения"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <Textarea
                    value={achievement.description}
                    onChange={(e) => handleAchievementChange(index, 'description', e.target.value)}
                    placeholder="Описание достижения"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Контактная информация */}
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <Input
                  name="phone"
                  value={companyInfo.contacts.phone}
                  onChange={handleContactsChange}
                  placeholder="+7 (123) 456-78-90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  value={companyInfo.contacts.email}
                  onChange={handleContactsChange}
                  placeholder="info@company.ru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Веб-сайт</label>
                <Input
                  name="website"
                  value={companyInfo.contacts.website}
                  onChange={handleContactsChange}
                  placeholder="www.company.ru"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={saveCompanyInfo}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить все изменения</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCompany;
