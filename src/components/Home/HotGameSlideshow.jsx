import { useContext, useRef, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { AppContext } from '../../AppContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import GameCard from '../GameCard';

const HotGameSlideshow = ({ games, name, title, icon, link, onGameClick }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const swiperRef = useRef(null);
    const uniqueId = useMemo(() => `slideshow-${name}-${Math.random().toString(36).substr(2, 9)}`, [name]);

    const handleGameClick = (game, isDemo = false) => {
        if (onGameClick) {
            onGameClick(game, isDemo);
        }
    };

    return (
        <>
            <header className="casino-widget__heading section-heading">
                <h2 className="section-heading__left">
                    <span className="section-heading__title title-2-semi-bold">
                        <i18n-t>{title}</i18n-t>
                    </span>
                </h2>
            </header>
            <div className="swiper-container">
                <Swiper
                    ref={swiperRef}
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={6.8}
                    breakpoints={{
                        0: { slidesPerView: 4, spaceBetween: 8 },
                        576: { slidesPerView: 5, spaceBetween: 10 },
                        992: { slidesPerView: 6.8, spaceBetween: 10 }
                    }}
                    navigation={{
                        prevEl: `.${uniqueId}-back`,
                        nextEl: `.${uniqueId}-next`,
                    }}
                    className="row-top-games"
                    style={{ width: '100%' }}
                >
                    {games?.map((game, index) => (
                        <SwiperSlide key={`hot-${name}-${game.id ?? index}-${index}`} className="top-game-item">
                            <GameCard
                                key={`hotcard-${name}-${game.id ?? index}-${index}`}
                                id={game.id}
                                provider={'Casino'}
                                title={game.name}
                                type="slideshow"
                                imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                onGameClick={() => {
                                    handleGameClick(game);
                                }}
                            />
                        </SwiperSlide>
                    ))}
                    <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                </Swiper>
                <div className="splide__arrows splide__arrows--ltr">
                    <button className={`${uniqueId}-back splide__arrow splide__arrow--prev slider-button slider-button--prev`}>
                        <svg-image glyph="chevron_left" width="24px" height="24px" fill="currentColor">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M8.3 12.7c-.4-.4-.4-1 0-1.4l4.5-4.5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.4 12l3.8 3.8c.4.4.4 1 0 1.4s-1 .4-1.4 0l-4.5-4.5z"></path></svg>
                        </svg-image>
                    </button>
                    <button className={`${uniqueId}-next splide__arrow splide__arrow--next slider-button slider-button--next`}>
                        <svg-image glyph="chevron_right" width="24px" height="24px" fill="currentColor">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="currentColor"><path d="M9.8 17.2c-.4-.4-.4-1 0-1.4l3.8-3.8-3.8-3.8c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l4.5 4.5c.4.4.4 1 0 1.4l-4.5 4.5c-.4.4-1 .4-1.4 0z"></path></svg>
                        </svg-image>
                    </button>
                </div>
                <div
                    className={`scroll-button left ${uniqueId}-back content-tile__back`}
                    tabIndex={0}
                    role="button"
                    aria-label="Previous slide"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div
                    className={`scroll-button right ${uniqueId}-next content-tile__next`}
                    tabIndex={0}
                    role="button"
                    aria-label="Next slide"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        </>
    );
};

export default HotGameSlideshow;