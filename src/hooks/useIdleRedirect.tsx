
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useIdleRedirect = (idleTime: number = 180000) => { // 3 минуты по умолчанию
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(true);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Не устанавливаем таймер для админ панели
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Не устанавливаем таймер для главной страницы
    if (location.pathname === '/') {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        console.log('Автоматический редирект на главную страницу из-за бездействия');
        navigate('/');
      }
    }, idleTime);
  }, [location.pathname, navigate, idleTime]);

  const handleActivity = useCallback(() => {
    isActiveRef.current = true;
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // События для отслеживания активности пользователя
    const events = [
      'mousedown', 
      'mousemove', 
      'keypress', 
      'scroll', 
      'touchstart', 
      'touchmove', 
      'touchend',
      'click',
      'dblclick',
      'keydown',
      'keyup'
    ];

    // Добавляем слушатели событий
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true, capture: true });
    });

    // Устанавливаем первоначальный таймер
    resetTimer();

    // Сохраняем статистику использования
    const updateStats = () => {
      try {
        const stats = JSON.parse(localStorage.getItem('kiosk_stats') || '{}');
        stats.lastActivity = new Date().toISOString();
        stats.totalVisitors = (stats.totalVisitors || 0) + 1;
        localStorage.setItem('kiosk_stats', JSON.stringify(stats));
      } catch (error) {
        console.error('Ошибка обновления статистики:', error);
      }
    };

    updateStats();

    // Очистка при размонтировании
    return () => {
      isActiveRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [location.pathname, handleActivity, resetTimer]);

  // Возвращаем функцию для ручного сброса таймера
  return resetTimer;
};
