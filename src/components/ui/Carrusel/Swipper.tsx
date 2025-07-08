import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface ImageData {
  src: any; // Cambiado a any para manejar imágenes importadas de Astro
  alt: string;
  title: string;
  description: string;
}

interface SwipperProps {
  images: ImageData[];
  className?: string;
}

export const Swipper = ({ images, className }: SwipperProps) => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      centeredSlides={true}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        480: {
          slidesPerView: 1.2,
          spaceBetween: 20,
          centeredSlides: true,
        },
        640: {
          slidesPerView: 1.5,
          spaceBetween: 25,
          centeredSlides: false,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
          centeredSlides: false,
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 35,
          centeredSlides: false,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 40,
          centeredSlides: false,
        },
      }}
      className={className}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="swiper-slide-content">
            <img 
              src={typeof image.src === 'string' ? image.src : image.src.src || image.src} 
              alt={image.alt}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
