
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useIdleRedirect = (idleTime: number = 180000) => { // 3 минуты
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Не устанавливаем таймер для админ панели
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      navigate('/');
    }, idleTime);
  };

  useEffect(() => {
    // События для отслеживания активности
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'touchmove', 'click'];

    const handleActivity = () => {
      resetTimer();
    };

    // Добавляем слушатели событий
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Устанавливаем первоначальный таймер
    resetTimer();

    // Очистка при размонтировании
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [location.pathname, navigate, idleTime]);

  return resetTimer;
};
