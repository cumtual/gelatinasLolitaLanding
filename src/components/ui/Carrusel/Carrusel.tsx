import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OptimizedImage } from '@/utils/imageUtils';
import styles from './index.module.scss';

interface CarouselProps {
  images?: Array<{
    src: string | { src: string };
    alt: string;
    title: string;
    description: string;
  }>;
  autoPlayDuration?: number;
}

const PhotoCarousel: React.FC<CarouselProps> = ({ 
  images = [],
  autoPlayDuration = 2000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: Date.now() });
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalSlides = images.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(nextSlide, autoPlayDuration);
  }, [nextSlide, autoPlayDuration]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [isAutoPlaying, isDragging, startAutoPlay, stopAutoPlay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);
  

  // Mejorar eventos táctiles para que funcionen en móvil
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevenir comportamiento predeterminado
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsDragging(true);
    setIsAutoPlaying(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevenir scroll mientras se hace swipe
  }, [isDragging]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const touch = e.changedTouches[0];
    const touchEnd = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const diffX = touchStartRef.current.x - touchEnd.x;
    const diffY = touchStartRef.current.y - touchEnd.y;
    const diffTime = touchEnd.time - touchStartRef.current.time;

    // Configuración de swipe
    const minSwipeDistance = 30; // Reducir para mayor sensibilidad
    const maxSwipeTime = 500;
    const minSwipeSpeed = 0.1;

    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);
    const swipeSpeed = absDiffX / diffTime;

    // Verificar si es un swipe horizontal válido
    const isHorizontalSwipe = absDiffX > absDiffY;
    const isValidDistance = absDiffX >= minSwipeDistance;
    const isValidTime = diffTime <= maxSwipeTime;
    const isValidSpeed = swipeSpeed >= minSwipeSpeed;

    if (isHorizontalSwipe && isValidDistance && (isValidTime || isValidSpeed)) {
      if (diffX > 0) {
        // Swipe izquierda -> siguiente
        nextSlide();
      } else {
        // Swipe derecha -> anterior
        prevSlide();
      }
    }

    setIsDragging(false);
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 2000);
  }, [isDragging, nextSlide, prevSlide]);

  const getPrevIndex = () => (currentSlide - 1 + totalSlides) % totalSlides;
  const getNextIndex = () => (currentSlide + 1) % totalSlides;

  // Estilos para prevenir comportamientos de Safari
  const imageStyles: any = {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    WebkitTouchCallout: 'none',
    WebkitUserDrag: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none'
  };

  return (
    <div className={styles.carouselContainer}>
      <div 
        ref={carouselRef}
        className={styles.carousel}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          touchAction: 'none', // Deshabilitar todos los gestos predeterminados
          userSelect: 'none'   // Prevenir selección de texto
        }}
      >
        <div className={styles.carouselTrack}>
          {images.map((image, index) => (
            <div 
              key={index}
              className={`${styles.slide} ${
                index === currentSlide ? styles.active : 
                index === getPrevIndex() ? styles.prev :
                index === getNextIndex() ? styles.next : ''
              }`}
            >
              <OptimizedImage
                src={typeof image.src === 'string' ? image.src : image.src.src}
                alt={image.alt}
                style={imageStyles}
              />
              <div className={styles.slideContent}>
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.carouselIndicators}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>

      </div>

      <div className={styles.floatingElements}>
        <div className={styles.floatingCircleCircle1}></div>
        <div className={styles.floatingCircleCircle2}></div>
        <div className={styles.floatingCircleCircle3}></div>
      </div>

    </div>
  );
};

export default PhotoCarousel;