import { useNavigate } from "react-router-dom";
import ImgBet from "/src/assets/img/feder-bet.webp";
import ImgLegal from "/src/assets/img/legal.webp";
import ImgStop from "/src/assets/img/stop.webp";
import ImgGCB from "/src/assets/img/gcb_sert.webp";

const Footer = ({ isSlotsOnly }) => {
    const navigate = useNavigate();
    const isSlotsOnlyMode = isSlotsOnly === "true" || isSlotsOnly === true;

    const menuItems = !isSlotsOnlyMode ? [
        {
            id: 'home',
            name: 'Home',
            href: '/'
        },
        {
            id: 'casino',
            name: 'Casino',
            href: '/casino'
        },
        {
            id: 'live-casino',
            name: 'Casino En Vivo',
            href: '/live-casino',
        },
        {
            id: 'sports',
            name: 'Deportes',
            href: '/sports'
        },
        {
            id: 'live-sports',
            name: 'Deportes En Vivo',
            href: '/live-sports'
        }
    ] : [
        {
            id: 'casino',
            name: 'Casino',
            href: '/casino'
        }
    ];

    return (
        <div className="footer-area">
            <footer className="footer section section--bottom">
                <div className="footer__section">
                    <ul className="links-setting" data-id="links">
                        {menuItems.map((menu, index) => (
                            <li key={index} className="links-setting__item" onClick={() => navigate(menu.href)}>
                                <a className="links-setting__link caption-1-regular">
                                    {menu.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer__section footer__section--row">
                    <dl className="promo-block">
                        <dt className="promo-block__title">
                            <i18n-t t="common-dictionary:Licenses">Licencias</i18n-t>
                        </dt>
                        <dd className="promo-block__details">
                            <ul className="promo-block__list">
                                <li className="promo-block__item promo-block__item--md">
                                    <a className="promo-block__link" href="http://federbet.com/" target="_blank">
                                        <i18n-t t="dynamic-footer:FederBet">FederBet</i18n-t>
                                    </a>
                                    <img src={ImgBet} className="promo-block__img" alt="FederBet"  />
                                </li>
                                <li className="promo-block__item promo-block__item--md">
                                    <img src={ImgLegal} className="promo-block__img" alt="Legal" />
                                </li>
                                <li className="promo-block__item promo-block__item--md">
                                    <a className="promo-block__link" href="https://www.gamblingtherapy.org/" target="_blank">
                                        <i18n-t t="dynamic-footer:Gambling">Gambling</i18n-t>
                                    </a>
                                    <img src={ImgStop} className="promo-block__img" alt="Gambling" />
                                </li>
                                <li className="promo-block__item promo-block__item--md">
                                    <img src={ImgGCB} className="promo-block__img" alt="GCB" />
                                </li>
                            </ul>
                        </dd>
                    </dl>
                </div>
            </footer>
        </div>
    );
};

export default Footer;