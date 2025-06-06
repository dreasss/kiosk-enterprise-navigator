
# Руководство по установке информационного киоска

## Системные требования

### Минимальные требования:
- Операционная система: Windows 10/11, Ubuntu 20.04+ или macOS 12+
- Процессор: Intel i3 или AMD Ryzen 3 (или эквивалент ARM)
- Оперативная память: 4 ГБ
- Свободное место на диске: 2 ГБ
- Сетевое подключение: Ethernet или Wi-Fi
- Сенсорный экран: поддержка multi-touch (рекомендуется)

### Рекомендуемые требования:
- Процессор: Intel i5 или AMD Ryzen 5
- Оперативная память: 8 ГБ
- SSD накопитель
- Стабильное интернет-подключение

## Установка в локальную сеть предприятия

### 1. Подготовка сервера

```bash
# Клонирование репозитория
git clone <repository-url>
cd kiosk-enterprise-navigator

# Установка зависимостей
npm install

# Сборка приложения
npm run build
```

### 2. Настройка веб-сервера

#### Nginx (рекомендуется)
```nginx
server {
    listen 80;
    server_name kiosk.company.local;
    root /path/to/kiosk-enterprise-navigator/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статических ресурсов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache
```apache
<VirtualHost *:80>
    ServerName kiosk.company.local
    DocumentRoot /path/to/kiosk-enterprise-navigator/dist
    
    <Directory "/path/to/kiosk-enterprise-navigator/dist">
        AllowOverride All
        Require all granted
    </Directory>
    
    # Перенаправление для SPA
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
```

### 3. Настройка киоск-режима

#### Windows (рекомендуется для киосков)
```powershell
# Установка Chrome в киоск-режиме
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --no-first-run --disable-infobars --disable-session-crashed-bubble --disable-dev-shm-usage --autoplay-policy=no-user-gesture-required http://kiosk.company.local
```

#### Linux (Ubuntu)
```bash
# Установка в автозапуск
cat > ~/.config/autostart/kiosk.desktop << EOF
[Desktop Entry]
Type=Application
Name=Kiosk
Exec=chromium-browser --kiosk --no-first-run --disable-infobars http://kiosk.company.local
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
EOF
```

## Настройка автономного режима

### Service Worker
Приложение автоматически кеширует критически важные данные для работы в автономном режиме:
- Карты объектов
- Информация о предприятии
- Статические ресурсы

### Настройка кеширования
```javascript
// В файле src/utils/cache.js
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа

// Данные кешируются автоматически в localStorage
// Для очистки кеша используйте админ-панель
```

## Администрирование

### Доступ к админ-панели
URL: `http://kiosk.company.local/admin`

### Основные настройки:
1. **Информация о предприятии** - название, логотип, описание
2. **Карта и объекты** - добавление/редактирование точек на карте
3. **Новости и события** - управление контентом
4. **Галерея** - загрузка фото и видео
5. **Настройки системы** - таймауты, внешний вид

### Резервное копирование
```bash
# Экспорт данных
curl http://kiosk.company.local/admin/export > backup.json

# Импорт данных
curl -X POST -H "Content-Type: application/json" -d @backup.json http://kiosk.company.local/admin/import
```

## Мониторинг и обслуживание

### Логирование
Все действия пользователей логируются в browser console и localStorage:
```javascript
// Просмотр статистики
console.log(JSON.parse(localStorage.getItem('kiosk_stats')));
```

### Автоматические обновления
```bash
# Скрипт для автообновления (cron job)
#!/bin/bash
cd /path/to/kiosk-enterprise-navigator
git pull origin main
npm run build
systemctl reload nginx
```

### Мониторинг работоспособности
```bash
# Проверка доступности
curl -f http://kiosk.company.local/health || echo "Киоск недоступен"
```

## Устранение неполадок

### Частые проблемы:
1. **Черный экран** - проверьте настройки браузера и URL
2. **Медленная работа** - очистите кеш браузера
3. **Не работает тач** - проверьте драйверы сенсорного экрана
4. **Ошибки загрузки** - проверьте сетевое подключение

### Диагностика:
```bash
# Проверка сети
ping kiosk.company.local

# Проверка веб-сервера
curl -I http://kiosk.company.local

# Проверка портов
netstat -tulpn | grep :80
```

## Безопасность

### Рекомендации:
- Используйте HTTPS в продакшене
- Ограничьте доступ к админ-панели по IP
- Регулярно обновляйте систему
- Настройте файрвол для ограничения исходящих соединений

### Настройка HTTPS
```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    # ... остальная конфигурация
}
```
