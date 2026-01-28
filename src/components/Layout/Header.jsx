import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import SearchInput from "../SearchInput";
import { callApi } from "../../utils/Utils";
import ImgLogo from "/src/assets/svg/logo-desktop.svg";
import ImgMobileLogo from "/src/assets/svg/logo-mobile.svg";
import ImgCloseMenu from "/src/assets/svg/close-menu.svg";
import ImgOpenMenu from "/src/assets/svg/open-menu.svg";
import ImgSearch from "/src/assets/svg/search.svg";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({
    isLogin,
    isMobile,
    userBalance,
    supportParent,
    handleLoginClick,
    openSupportModal,
}) => {
    const { contextData } = useContext(AppContext);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const [isLoadingGames, setIsLoadingGames] = useState(false);
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchDelayTimer, setSearchDelayTimer] = useState();

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            let keyword = e.target.value;
            do_search(keyword);
        } else {
            if (
                (e.keyCode >= 48 && e.keyCode <= 57) ||
                (e.keyCode >= 65 && e.keyCode <= 90) ||
                e.keyCode == 8 ||
                e.keyCode == 46
            ) {
                do_search(keyword);
            }
        }

        if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
            searchRef.current?.blur();
        }
    };

    const do_search = (keyword) => {
        clearTimeout(searchDelayTimer);

        if (keyword == "") {
            return;
        }

        setGames([]);
        setIsLoadingGames(true);

        let pageSize = 50;

        let searchDelayTimerTmp = setTimeout(function () {
            callApi(
                contextData,
                "GET",
                "/search-content?keyword=" + txtSearch + "&page_group_code=" + "default_pages_home" + "&length=" + pageSize,
                callbackSearch,
                null
            );
        }, 1000);

        setSearchDelayTimer(searchDelayTimerTmp);
    };

    const callbackSearch = (result) => {
        if (result.status === 500 || result.status === 422) {

        } else {
            configureImageSrc(result);
            setGames(result.content);
        }
        setIsLoadingGames(false);
    };

    return (
        <header className="header" id="header-layout" data-authentificated="true" data-screen-area="navigation">
            <div className="header__wrapper" data-id="header-wrapper">
                <a className="header__logo" href="/">
                    <img className="header__img" width="120px" height="56px" src="/static/iolite/layout/jbbo_logo.webp" alt="logo" data-id="logo" />
                </a>
                <nav className="header__nav">
                    <ul className="header__list">
                        <li className="header__item">
                            <a href="/football/live/1" className="tab">
                                <div className="tab__icon">
                                    <svg-image url="/layout" glyph="microphone_outlined" width="24px" height="24px" fill="currentColor" data-glyph="microphone_outlined" data-active-glyph="microphone_filled" data-is-skeleton="true">
                                    </svg-image>
                                </div>
                                <div className="tab__title">
                                    <i18n-t className="tab__text" t="common-dynamic-components:Live Events" data-is-skeleton="true">Deportes en vivo</i18n-t>
                                </div>
                            </a>
                        </li>
                        <li className="header__item">

                            <a href="/football/prematch/1"  data-id="tab-upcoming-matches">
                                <div className="tab__icon">

                                    <svg-image url="/layout" glyph="sports_outlined" width="24px" height="24px" fill="currentColor" data-glyph="sports_outlined" data-active-glyph="sports_filled" data-is-skeleton="true">
                                    </svg-image>

                                </div>
                                <div className="tab__title">
                                    <i18n-t className="tab__text" t="common-dynamic-components:Upcoming Matches" data-is-skeleton="true">Próximos partidos</i18n-t>
                                </div>
                            </a>
                        </li>
                        <li className="header__item">
                            <a href="/my-bets-history" className="tab">
                                <div className="tab__icon">
                                    <in-view module-name="open-bets-lazy-module">
                                    </in-view>

                                    <svg-image url="/layout" glyph="coupon_outlined" width="24px" height="24px" fill="currentColor" data-glyph="coupon_outlined" data-active-glyph="coupon_filled" data-is-skeleton="true">
                                    </svg-image>

                                </div>
                                <div className="tab__title">
                                    <i18n-t className="tab__text" t="common-dynamic-components:My bets" data-is-skeleton="true">Apuestas</i18n-t>
                                </div>
                            </a>
                        </li>
                        <li className="header__item">

                            <a href="/services/lobby" className="tab
   " data-clickstream-payload="{&quot;element_name&quot;: &quot;Casino&quot;, &quot;position_index&quot;: 3, &quot;nav_element&quot;: &quot;nav_bar&quot; }" data-id="tab-casino">
                                <div className="tab__icon">

                                    <svg-image url="/layout" glyph="chip_outlined" width="24px" height="24px" fill="currentColor" data-glyph="chip_outlined" data-active-glyph="chip_filled" data-is-skeleton="true">
                                    </svg-image>

                                </div>
                                <div className="tab__title">
                                    <i18n-t className="tab__text" t="common-dynamic-components:Casino" data-is-skeleton="true">Casino</i18n-t>
                                </div>
                            </a>
                        </li>
                        <li className="header__item">

                            <a href="/services/live-casino" className="tab
   " data-clickstream-payload="{&quot;element_name&quot;: &quot;Live Casino&quot;, &quot;position_index&quot;: 4, &quot;nav_element&quot;: &quot;nav_bar&quot; }" data-id="tab-live-casino">
                                <div className="tab__icon">

                                    <svg-image url="/layout" glyph="live_casino_outlined" width="24px" height="24px" fill="currentColor" data-glyph="live_casino_outlined" data-active-glyph="live_casino_filled" data-is-skeleton="true">
                                    </svg-image>

                                </div>
                                <div className="tab__title">
                                    <i18n-t className="tab__text" t="common-dynamic-components:Live Casino" data-is-skeleton="true">Casino en vivo</i18n-t>
                                </div>
                            </a>
                        </li>
                        <li className="header__item">

                            <a href="/services/promo" className="tab
   " data-clickstream-payload="{&quot;element_name&quot;: &quot;Promotions&quot;, &quot;position_index&quot;: 5, &quot;nav_element&quot;: &quot;nav_bar&quot; }" data-id="tab-promotions">
                                <div className="tab__icon">

                                    <svg-image url="/layout" glyph="promo_outlined" width="24px" height="24px" fill="currentColor" data-glyph="promo_outlined" data-active-glyph="promo_filled" data-is-skeleton="true">
                                    </svg-image>

                                </div>
                                <div className="tab__title">
                                    <i18n-t className="tab__text" t="common-dynamic-components:Promotions" data-is-skeleton="true">Promos</i18n-t>
                                </div>
                            </a>
                        </li>
                    </ul>

                </nav>
                <nav className="header__user-nav">



                    <div className="header__actions">
                        <a className="header__tab" data-id="header-search-button" data-clickstream-payload="{&quot;element_name&quot;: &quot;search-icon&quot;, &quot;position_index&quot;: 0, &quot;nav_element&quot;: &quot;nav_bar&quot;}" href="/search">
                            <span className="header__icon">
                                <svg-image glyph="search" width="100%" height="100%" fill="currentColor" data-is-skeleton="true"></svg-image>
                            </span>
                        </a>

                        <button className="header__tab" type="button" aria-label="Toggle notification center" data-notification-toggle="" data-clickstream-payload="{&quot;element_name&quot;: &quot;notification&quot;, &quot;position_index&quot;: 2, &quot;nav_element&quot;: &quot;nav_bar&quot; }">
                            <span className="header__icon">
                                <div className="header__counter counter">3</div>
                                <svg-image glyph="notification_outline" width="100%" height="100%" fill="currentColor" data-is-skeleton="true"></svg-image>
                            </span>
                        </button>




                        <a className="header__tab header__tab--flexible " data-clickstream-action="NAV_ACCOUNT_BUTTON" data-id="user-info" href="/account">
                            <span className="header__icon">
                                <svg-image url="/layout" glyph="my account_outlined" width="100%" height="100%" fill="currentColor" aria-label="Profile" data-is-skeleton="true">
                                </svg-image>
                            </span>
                            <div className="header__group" data-currency-sign="$">
                                <bdi className="header__label" data-player-balance-amount="" data-id="user-info-balance-amount">0.00 $</bdi>
                            </div>
                        </a>
                    </div>

                    <a className="button button--low button--deposit" data-id="deposit-button" data-clickstream-payload="{&quot;element_name&quot;: &quot;deposit&quot;, &quot;position_index&quot;: 0, &quot;nav_element&quot;: &quot;nav_bar&quot; }" href="/deposit">
                        <i18n-t t="registration-section:Deposit">Depositar</i18n-t>
                    </a>
                </nav>
            </div>
    </header >
    );
};

export default Header;