import { useRef, useState, useEffect } from 'react';
import { useOutletContext } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import ImgBanner1 from "/src/assets/img/banner1.webp";
import ImgBanner2 from "/src/assets/img/banner2.webp";
import ImgBanner3 from "/src/assets/img/banner3.webp";
import ImgBanner4 from "/src/assets/img/banner4.webp";
import ImgBanner5 from "/src/assets/img/banner5.webp";
import ImgBanner6 from "/src/assets/img/banner6.webp";
import ImgBanner7 from "/src/assets/img/banner7.webp";
import ImgBanner8 from "/src/assets/img/banner8.webp";
import ImgBanner9 from "/src/assets/img/banner9.webp";
import ImgBanner10 from "/src/assets/img/banner10.webp";

const Slideshow = () => {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(1);
  const { isMobile } = useOutletContext();

  const slides = [
    { id: 0, image: ImgBanner1 },
    { id: 1, image: ImgBanner2 },
    { id: 2, image: ImgBanner3 },
    { id: 3, image: ImgBanner4 },
    { id: 4, image: ImgBanner5 },
    { id: 5, image: ImgBanner6 },
    { id: 6, image: ImgBanner7 },
    { id: 7, image: ImgBanner8 },
    { id: 8, image: ImgBanner9 },
    { id: 9, image: ImgBanner10 },
  ];

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleSlideChange = (swiper) => {
    const realIndex = swiper.realIndex + 1;
    setCurrentSlide(realIndex);
  };

  // Update slide number when slides change
  useEffect(() => {
    if (swiperRef.current) {
      setCurrentSlide(swiperRef.current.swiper.realIndex + 1);
    }
  }, []);

  return (
    <div className="promo-bar__slider splide splide--loop splide--ltr splide--draggable is-active is-overflow is-initialized">
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={3.5}
        breakpoints={{
          320: { slidesPerView: 1.5, spaceBetween: 10 },
          768: { slidesPerView: 3.5, spaceBetween: 10 },
        }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={!isMobile ? {
          nextEl: '.desktop-next',
          prevEl: '.desktop-prev',
        } : false}
        onSlideChange={(swiper) => handleSlideChange(swiper)}
        onInit={(swiper) => {
          setCurrentSlide(swiper.realIndex + 1);
        }}
        className="splide__slide splide__slide--clone"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <a className="banner">
              <img
                src={slide.image}
                alt={`Banner ${slide.id + 1}`}
                style={{
                  width: "100%",
                  height: "100%"
                }}
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slideshow;