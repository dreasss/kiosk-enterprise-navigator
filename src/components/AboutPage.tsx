
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Building, Users, Calendar, Award, Target, MapPin } from 'lucide-react';

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

const AboutPage = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    description: '',
    founded: '',
    employees: '',
    address: '',
    mission: '',
    vision: '',
    values: [],
    achievements: [],
    contacts: {
      phone: '',
      email: '',
      website: ''
    }
  });

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = () => {
    try {
      const stored = localStorage.getItem('company_info');
      if (stored) {
        setCompanyInfo(JSON.parse(stored));
      } else {
        // Демо данные
        const demoInfo: CompanyInfo = {
          name: 'ООО "Современное Предприятие"',
          description: 'Ведущее предприятие в области высокотехнологичного производства с многолетней историей успешной работы на российском и международном рынках.',
          founded: '1995',
          employees: '1200+',
          address: 'г. Москва, ул. Промышленная, д. 15',
          mission: 'Предоставление высококачественной продукции и услуг, способствующих развитию промышленности и улучшению качества жизни людей.',
          vision: 'Стать лидером в области инновационных технологий и устойчивого развития, обеспечивая долгосрочную ценность для всех заинтересованных сторон.',
          values: [
            'Качество и надежность',
            'Инновации и развитие',
            'Ответственность перед обществом',
            'Уважение к сотрудникам',
            'Экологическая безопасность'
          ],
          achievements: [
            {
              year: '2023',
              title: 'Сертификация ISO 14001',
              description: 'Получение международного сертификата системы экологического менеджмента'
            },
            {
              year: '2022',
              title: 'Премия "Лучшее предприятие года"',
              description: 'Награда от Министерства промышленности за выдающиеся достижения'
            },
            {
              year: '2021',
              title: 'Внедрение Industry 4.0',
              description: 'Успешная цифровизация производственных процессов'
            },
            {
              year: '2020',
              title: '25 лет на рынке',
              description: 'Юбилей компании и достижение значимых показателей'
            }
          ],
          contacts: {
            phone: '+7 (495) 123-45-67',
            email: 'info@enterprise.ru',
            website: 'www.enterprise.ru'
          }
        };
        setCompanyInfo(demoInfo);
        localStorage.setItem('company_info', JSON.stringify(demoInfo));
      }
    } catch (error) {
      console.log('Ошибка загрузки информации о предприятии:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">О предприятии</h1>

        {/* Основная информация */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-6 h-6 text-blue-600" />
                <span>{companyInfo.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-lg leading-relaxed">
                {companyInfo.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ключевые факты</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Основано</div>
                  <div className="text-gray-600">{companyInfo.founded} год</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Сотрудников</div>
                  <div className="text-gray-600">{companyInfo.employees}</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <div className="font-medium">Адрес</div>
                  <div className="text-gray-600">{companyInfo.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Миссия и видение */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Миссия</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{companyInfo.mission}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-purple-600" />
                <span>Видение</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{companyInfo.vision}</p>
            </CardContent>
          </Card>
        </div>

        {/* Ценности */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Наши ценности</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companyInfo.values.map((value, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-600"
                >
                  <div className="font-medium text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Достижения */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-gold-600" />
              <span>Достижения и награды</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {companyInfo.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {achievement.year.slice(-2)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Контакты */}
        <Card>
          <CardHeader>
            <CardTitle>Контактная информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-2">Телефон</div>
                <div className="text-blue-600 font-mono">{companyInfo.contacts.phone}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-2">Email</div>
                <div className="text-blue-600">{companyInfo.contacts.email}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800 mb-2">Веб-сайт</div>
                <div className="text-blue-600">{companyInfo.contacts.website}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
