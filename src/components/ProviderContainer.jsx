import { useContext } from "react";
import { AppContext } from "../AppContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ProviderContainer = ({
    categories,
    onProviderSelect,
}) => {
    const { contextData } = useContext(AppContext);

    const providers = categories.filter((cat) => cat.code && cat.code !== "home");

    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };

    return (
        <ul className="qabs" data-id="qab-container">
            <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView="auto"
                centeredSlides={false}
                grabCursor={true}
                loop={providers.length > 6}
                navigation={{
                    prevEl: ".custom-swiper-button-prev",
                    nextEl: ".custom-swiper-button-next",
                }}
                breakpoints={{
                    320: { slidesPerView: 6 },
                    768: { slidesPerView: 11 },
                    1280: { slidesPerView: 14 },
                }}
                className="!overflow-visible"
            >
            {
                providers.map((provider, idx) => {
                    const imageUrl = provider.image_local
                        ? `${contextData.cdnUrl}${provider.image_local}`
                        : provider.image_url;

                    return (
                        <SwiperSlide key={idx} data-id="qab-parent">
                            <div className="qab" onClick={(e) => handleClick(e, provider)}>
                                <figure className="qab__visual">
                                    {
                                        imageUrl && 
                                        <img slot="image" src={imageUrl} alt={provider.name} loading="eager" decoding="async" width="32" height="32" />
                                    }
                                </figure>
                                <span className="qab__text">
                                    <i18n-t slot="title" t="common-dynamic-components:Promos">{provider.name}</i18n-t>
                                </span>
                            </div>
                        </SwiperSlide>
                    )
                })
            }
            </Swiper>
        </ul>
    );
};

export default ProviderContainer;