import { useNavigate } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo.webp";
import ImgSports from "/src/assets/svg/sports.svg";
import ImgMic from "/src/assets/svg/microphone.svg";
import ImgCasino from "/src/assets/svg/casino.svg";
import ImgLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgSearch from "/src/assets/svg/search.svg";
import ImgAccount from "/src/assets/svg/account.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    handleLoginClick,
    openSupportModal,
    isSlotsOnly
}) => {
    const navigate = useNavigate();

    const navItems = isSlotsOnly === "false" ? [
        { path: ["/sports"], label: "Deportes", img: ImgSports },
        { path: ["/live-sports"], label: "Deportes en vivo", img: ImgMic },
        { path: ["/casino"], label: "Casino", img: ImgCasino },
        { path: ["/live-casino"], label: "Casino en vivo", img: ImgLiveCasino }
    ] : [
        { path: ["/casino"], label: "CASINO", img: ImgCasino }
    ];

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <header className="header" id="header-layout">
            <div className="header__wrapper">
                <a className="header__logo" href="/">
                    <img className="header__img" width="120px" height="56px" src={ImgLogo} alt="logo" />
                </a>
                <nav className="header__nav">
                    <ul className="header__list">
                        {navItems.map((item, idx) => (
                            <li key={idx} className="header__item">
                                <a onClick={() => navigate(Array.isArray(item.path) ? item.path[item.path.length - 1] : item.path)} className="tab">
                                    <div className="tab__icon">
                                        <img src={item.img} />
                                    </div>
                                    <div className="tab__title">
                                        {item.label}
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <nav className="header__user-nav">
                    <div className="header__actions">
                        <a className="header__tab">
                            <span className="header__icon" onClick={() => navigate("/search")}>
                                <img src={ImgSearch} />
                            </span>
                        </a>
                        <button className="button-support" onClick={() => { openSupportModal(false); }}>
                            <img src={ImgSupport} />
                        </button>
                        {
                            isLogin ? <>
                                <a className="header__tab header__tab--flexible" onClick={() => navigate("/account")}>
                                    <span className="header__icon">
                                        <img src={ImgAccount} />
                                    </span>
                                    <div className="header__group">
                                        <bdi className="header__label">$ {formatBalance(userBalance || 0)}</bdi>
                                    </div>
                                </a>
                            </> :
                            <a className="button button--low button--secondary" id="loginButton" title="Log in" onClick={handleLoginClick}>
                                <i18n-t className="button__text">Iniciar sesión</i18n-t>
                            </a>
                        }
                    </div>
                </nav>
            </div>
        </header >
    );
};

export default Header;