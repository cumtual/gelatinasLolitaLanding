import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OptimizedImage } from '@utils/imageUtils';
import styles from './index.module.scss';

interface CarouselProps {
  images?: Array<{
    src: string | ImageData;
    alt: string;
    title: string;
    description: string;
  }>;
  autoPlayDuration?: number;
}

const PhotoCarousel: React.FC<CarouselProps> = ({ 
  images = [],
  autoPlayDuration = 4000 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });

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
    if (isAutoPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }

    return () => stopAutoPlay();
  }, [isAutoPlaying, startAutoPlay, stopAutoPlay]);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    setIsAutoPlaying(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndRef.current = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const diffX = touchStartRef.current.x - touchEndRef.current.x;
    const diffY = touchStartRef.current.y - touchEndRef.current.y;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    setIsAutoPlaying(true);
  };

  const getPrevIndex = () => (currentSlide - 1 + totalSlides) % totalSlides;
  const getNextIndex = () => (currentSlide + 1) % totalSlides;

  return (
    <div className={styles.carouselContainer}>
      <div 
        className={styles.carousel}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
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
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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