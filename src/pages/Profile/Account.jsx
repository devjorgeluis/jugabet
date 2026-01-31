import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import LoadApi from "../../components/Loading/LoadApi";
import IconClose from "/src/assets/svg/close.svg";
import IconIntercom from "/src/assets/svg/intercom.svg";
import IconDeposit from "/src/assets/svg/deposit.svg";
import IconProfile from "/src/assets/svg/profile.svg";
import IconHistory from "/src/assets/svg/history.svg";
import IconLogout from "/src/assets/svg/logout.svg";
import IconArrowRight from "/src/assets/svg/arrow-right.svg";

const Account = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const handleLogoutClick = () => {
        setIsLoading(true);
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    setIsLoading(false);
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };    

    return (
        <section className="section section--top section--cover">
            <div className="account">
                <header className="navigation-bar">
                    <button className="navigation-bar__left" type="button" onClick={() => navigate("/")}>
                        <img src={IconClose} alt="Close" />
                    </button>

                    <h1 className="navigation-bar__center body-semi-bold">
                        <i18n-t t="my-account-section:My account">Mi cuenta</i18n-t>
                    </h1>

                    <button className="navigation-bar__right button" type="button">
                        <img src={IconIntercom} alt="Support" />
                    </button>
                </header>

                <div className="account__container account__container--top section__item" data-id="account-container">
                    <div className="account__wallet">
                        <a className="list-cell" data-id="account-balance-btn" href="/balance-wallet">
                            <div className="list-cell__icon">
                                <img src={IconDeposit} alt="Deposit" />
                            </div>
                            <div className="list-cell__left">
                                <div className="list-cell__double">
                                    <i18n-t className="caption-1-regular" t="my-account-section:Total balance">Balance total</i18n-t>
                                    <bdi className="list-cell__title title-2-semi-bold">
                                        $ {formatBalance(contextData?.session?.user?.balance)}
                                    </bdi>
                                </div>
                            </div>
                            <div className="list-cell__right">
                                <img src={IconArrowRight} alt="Arrow" />
                            </div>
                        </a>
                    </div>
                </div>
                <div className="account__container section__item">
                    <section className="account__list-view list-view">
                        <header className="section-heading">
                            <h2 className="section-heading__left section-heading__title caption-1-regular-caps">
                                <i18n-t t="my-account-section:Account">Cuenta</i18n-t>
                            </h2>
                        </header>
                        <ul className="list-view__layout" id="account__balance-botContainer">
                            <li className="list-view__item list-view__item--icon">
                                <a className="list-cell" onClick={() => navigate("/profile/detail")}>
                                    <div className="list-cell__icon">
                                        <img src={IconProfile} alt="Profile" />
                                    </div>
                                    <div className="list-cell__left">
                                        <span className="list-cell__title body-regular" id="user-info-account-balance">
                                            <i18n-t t="my-account-section:Personal data">Datos personales</i18n-t>
                                        </span>
                                    </div>
                                    <div className="list-cell__right">
                                        <img src={IconArrowRight} alt="Arrow" />
                                    </div>
                                </a>
                            </li>
                            <li className="list-view__item list-view__item--icon">
                                <a className="list-cell" onClick={() => navigate("/profile/history")}>
                                    <div className="list-cell__icon">
                                        <img src={IconHistory} alt="History" />
                                    </div>
                                    <div className="list-cell__left">
                                        <span className="list-cell__title body-regular">
                                            <i18n-t t="my-account-section:Payment history">Historial de pagos</i18n-t>
                                        </span>
                                    </div>
                                    <div className="list-cell__right">
                                        <img src={IconArrowRight} alt="Arrow" />
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </section>

                    <div className="list-cell list-cell--clickable" role="button" onClick={handleLogoutClick}>
                        <div className="list-cell__icon">
                            <img src={IconLogout} alt="Logout" />
                        </div>
                        <div className="list-cell__left">
                            <span className="list-cell__title body-regular">
                                <i18n-t t="my-account-section:Logout">Cerrar sesión</i18n-t>
                            </span>
                        </div>
                        <div className="list-cell__right">
                            { isLoading ? <LoadApi /> : <img src={IconArrowRight} alt="Arrow" /> }
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Account;