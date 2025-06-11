import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface ImageData {
  src: string;
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
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      }}
      className={className}
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div className="swiper-slide-content">
            <img 
              src={image.src} 
              alt={image.alt}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
