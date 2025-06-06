
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, ArrowLeft, Users, Award, Target, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedButton } from './ui/animated-button';
import { useIdleRedirect } from '../hooks/useIdleRedirect';

interface CompanyInfo {
  name: string;
  logo: string;
  description: string;
  founded: string;
  employees: number;
  achievements: string[];
  mission: string;
  values: string[];
  departments: Array<{
    name: string;
    description: string;
    head: string;
    employees: number;
  }>;
}

const AboutPage = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  // Автоматический редирект при бездействии
  useIdleRedirect();

  useEffect(() => {
    // Загрузка информации о компании из localStorage или демо данные
    const loadCompanyInfo = () => {
      const stored = localStorage.getItem('company_info');
      if (stored) {
        setCompanyInfo(JSON.parse(stored));
      } else {
        const demoInfo: CompanyInfo = {
          name: 'ООО "Инновационные Технологии"',
          logo: '🏭',
          description: 'Ведущее предприятие в области производства высокотехнологичного оборудования и инновационных решений для промышленности.',
          founded: '1995',
          employees: 450,
          achievements: [
            'Лауреат премии "Лучшее предприятие года" 2023',
            'Сертификат качества ISO 9001:2015',
            'Более 100 патентов на изобретения',
            'Экспорт в 15 стран мира'
          ],
          mission: 'Создание инновационных технологических решений, которые делают промышленность более эффективной и экологичной.',
          values: [
            'Инновации и развитие',
            'Качество и надежность',
            'Экологическая ответственность',
            'Командная работа',
            'Клиентоориентированность'
          ],
          departments: [
            {
              name: 'Отдел разработки',
              description: 'Создание новых технологий и продуктов',
              head: 'Иванов А.П.',
              employees: 45
            },
            {
              name: 'Производственный отдел',
              description: 'Изготовление высококачественной продукции',
              head: 'Петров В.С.',
              employees: 180
            },
            {
              name: 'Отдел качества',
              description: 'Контроль качества на всех этапах производства',
              head: 'Сидорова М.И.',
              employees: 25
            },
            {
              name: 'Отдел продаж',
              description: 'Работа с клиентами и развитие рынков сбыта',
              head: 'Козлов Д.А.',
              employees: 30
            }
          ]
        };
        setCompanyInfo(demoInfo);
        localStorage.setItem('company_info', JSON.stringify(demoInfo));
      }
    };

    loadCompanyInfo();
  }, []);

  if (!companyInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Заголовок */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <AnimatedButton variant="outline" size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                На главную
              </AnimatedButton>
            </Link>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">О предприятии</h1>
              <p className="text-gray-600 text-lg">История, структура и достижения</p>
            </div>
          </div>
        </div>

        {/* Основная информация */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="text-6xl mb-4">{companyInfo.logo}</div>
            <CardTitle className="text-3xl text-gray-800 mb-2">
              {companyInfo.name}
            </CardTitle>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              {companyInfo.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-blue-600">{companyInfo.founded}</div>
                <div className="text-gray-600">Год основания</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">{companyInfo.employees}</div>
                <div className="text-gray-600">Сотрудников</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-purple-600">15+</div>
                <div className="text-gray-600">Стран экспорта</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Миссия */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="w-6 h-6 mr-2 text-blue-600" />
                Наша миссия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-lg leading-relaxed">
                {companyInfo.mission}
              </p>
            </CardContent>
          </Card>

          {/* Ценности */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Award className="w-6 h-6 mr-2 text-green-600" />
                Наши ценности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {companyInfo.values.map((value, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Достижения */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <History className="w-6 h-6 mr-2 text-purple-600" />
              Наши достижения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyInfo.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Структура предприятия */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Users className="w-6 h-6 mr-2 text-orange-600" />
              Структура предприятия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyInfo.departments.map((dept, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{dept.name}</h3>
                  <p className="text-gray-600 mb-4">{dept.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Руководитель: {dept.head}</span>
                    <Badge variant="secondary">{dept.employees} чел.</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
