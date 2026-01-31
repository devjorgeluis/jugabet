import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgCasino from "/src/assets/svg/blue-casino.svg";
import ImgLiveCasino from "/src/assets/svg/blue-live-casino.svg";
import ImgSports from "/src/assets/svg/blue-sports.svg";
import ImgFooterCasino from "/src/assets/svg/casino.svg";
import ImgFooterLiveCasino from "/src/assets/svg/live-casino.svg";
import ImgFooterSports from "/src/assets/svg/sports.svg";
import ImgMenu from "/src/assets/svg/menu.svg";
import ImgClose from "/src/assets/svg/close.svg";
import ImgPhone from "/src/assets/svg/phone.svg";
import IconArrowDown from "/src/assets/svg/arrow-down.svg";
import IconArrowUp from "/src/assets/svg/arrow-up.svg";
import IconArrowRight from "/src/assets/svg/arrow-right.svg";
import ImgCategoryHome from "/src/assets/img/lobby.webp";
import ImgCategoryPopular from "/src/assets/img/hot.png";
import ImgCategoryBlackjack from "/src/assets/img/joker.png";
import ImgCategoryRoulette from "/src/assets/img/roulette.png";
import ImgCategoryCrash from "/src/assets/img/crash.webp";
import ImgCategoryMegaways from "/src/assets/img/megaway.png";

const MobileFooter = ({
    isSlotsOnly,
    isMobile,
    supportParent,
    openSupportModal,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);

    const [expandedMenus, setExpandedMenus] = useState([]);
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);

    const showFullMenu = isSlotsOnly === "false" || isSlotsOnly === false;

    const toggleMenu = (menuId) => {
        setExpandedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((item) => item !== menuId)
                : [...prev, menuId]
        );
    };

    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

    // Fetch live casino categories
    useEffect(() => {
        if (!hasFetchedLiveCasino) {
            callApi(
                contextData,
                "GET",
                "/get-page?page=livecasino",
                (result) => {
                    if (result.status === 500 || result.status === 422) return;

                    const menus = [{ name: "Inicio", code: "home", href: "/live-casino#home" }];
                    result.data.categories.forEach((element) => {
                        menus.push({
                            name: element.name,
                            href: `/live-casino#${element.code}`,
                            code: element.code,
                        });
                    });

                    setLiveCasinoMenus(menus);
                    setHasFetchedLiveCasino(true);
                },
                null
            );
        }
    }, [hasFetchedLiveCasino, contextData]);

    // Auto-expand based on route
    useEffect(() => {
        const currentPath = location.pathname;
        const hash = location.hash.slice(1);

        if (currentPath.startsWith("/live-casino") && hash && !isMenuExpanded("live-casino")) {
            setExpandedMenus((prev) => [...prev, "live-casino"]);
        }

        if (currentPath.startsWith("/profile") && !isMenuExpanded("profile")) {
            setExpandedMenus((prev) => [...prev, "profile"]);
        }
    }, [location.pathname, location.hash]);

    const isActive = (path) => {
        if (path === "/" && location.pathname === "/") {
            return true;
        }
        
        return location.pathname.startsWith(path);
    };

    const getActiveClass = (path) => {
        return isActive(path) && !isSidebarExpanded ? "tab--active tab--active-route" : "";
    };

    const isSlotsOnlyMode = isSlotsOnly === true || isSlotsOnly === "true";

    const menuItems = [
        {
            id: "casino",
            name: "Casino",
            image: ImgCasino,
            href: "/casino",
            subItems: [
                { name: "Lobby", href: "/casino#home", image: ImgCategoryHome },
                { name: "Hot", href: "/casino#hot", image: ImgCategoryPopular },
                { name: "Jokers", href: "/casino#joker", image: ImgCategoryBlackjack },
                { name: "Juegos de Crash", href: "/casino#arcade", image: ImgCategoryCrash },
                { name: "Megaways", href: "/casino#megaways", image: ImgCategoryMegaways },
                { name: "Ruletas", href: "/casino#roulette", image: ImgCategoryRoulette },
            ],
        },
        ...(isSlotsOnlyMode
            ? []
            : [
                {
                    id: "live-casino",
                    name: "Casino en Vivo",
                    image: ImgLiveCasino,
                    href: "/live-casino",
                    subItems: liveCasinoMenus,
                },
                {
                    id: "sports",
                    name: "Deportes",
                    image: ImgSports,
                    href: "/sports",
                    subItems: [
                        { name: "Inicio", href: "/sports" },
                        { name: "En Vivo", href: "/live-sports" },
                    ],
                },
            ]),
        ...(supportParent
            ? [
                {
                    id: "support",
                    name: "Contactá a Tu Cajero",
                    image: ImgPhone,
                    href: "#",
                    subItems: [],
                    action: () => {
                        openSupportModal(true);
                    },
                },
            ]
            : []),
    ];

    const handleNavigation = (item) => (e) => {
        if (isSidebarExpanded) {
            toggleSidebar();
        }
        e?.stopPropagation();
        if (item.action) {
            item.action();
        } else if (item.href !== "#") {
            navigate(item.href);
        }
    };

    const isMenuActive = (item) => {
        const currentPath = location.pathname;
        const hash = location.hash;

        if (item.href === currentPath) return true;
        if (item.href.includes("#")) {
            return location.pathname + location.hash === item.href;
        }
        if (item.id === "profile" && currentPath.startsWith("/profile")) return true;
        return false;
    };

    const isActiveSubmenu = (href) => {
        if (href.includes("#")) {
            return location.pathname + location.hash === href;
        }
        return location.pathname === href;
    };

    // Render menu items from the menuItems array
    const renderMenuItems = () => {
        return menuItems.map((item) => {
            const isExpanded = isMenuExpanded(item.id);
            const isActive = isMenuActive(item);
            const hasSubItems = item.subItems && item.subItems.length > 0;

            if (!hasSubItems) {
                return (
                    <div
                        key={item.id}
                        className={`menu__item ${isActive ? 'menu__item--active' : ''}`}
                        data-id={`menu-list-items-${item.id}`}
                        onClick={handleNavigation(item)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="menu__list-cell list-cell list-cell--transparent">
                            <div className="list-cell__icon">
                                <img
                                    src={item.image}
                                    width="24px"
                                    height="24px"
                                    alt={item.name}
                                    style={{ filter: 'var(--icon-main-filter)' }}
                                />
                            </div>
                            <div className="list-cell__left">
                                <div className="list-cell__double">
                                    <span className="list-cell__title body-regular">
                                        {item.name}
                                    </span>
                                </div>
                            </div>
                            <div className="list-cell__right">
                                <img src={IconArrowRight} alt="arrow" />
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div
                    key={item.id}
                    className={`menu__item ${isExpanded ? 'menu__item--expanded' : ''} ${isActive ? 'menu__item--active' : ''}`}
                    data-id={`menu-list-items-${item.id}`}
                >
                    <div
                        className="menu__list-cell list-cell list-cell--transparent"
                        onClick={() => toggleMenu(item.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="list-cell__icon">
                            <img
                                src={item.image}
                                width="24px"
                                height="24px"
                                alt={item.name}
                                style={{ filter: 'var(--icon-main-filter)' }}
                            />
                        </div>
                        <div className="list-cell__left">
                            <div className="list-cell__double">
                                <span className="list-cell__title body-regular">
                                    {item.name}
                                </span>
                            </div>
                        </div>
                        <div className="list-cell__right">
                            <img
                                src={isExpanded ? IconArrowDown : IconArrowUp}
                                alt={isExpanded ? "arrow-down" : "arrow-up"}
                                className="menu__chevron"
                            />
                        </div>
                    </div>

                    {isExpanded && hasSubItems && (
                        <div className="menu__expansion-panel list-view" data-id={`menu-list-${item.id}-category`}>
                            <ul className="list-view__layout">
                                {item.subItems.map((subItem, index) => (
                                    <li key={`${item.id}-${index}`} className="list-view__item list-view__item--icon">
                                        <a
                                            href={subItem.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                navigate(subItem.href);
                                                if (isSidebarExpanded) {
                                                    toggleSidebar();
                                                }
                                            }}
                                            className={isActiveSubmenu(subItem.href) ? 'active' : ''}
                                        >
                                            <div className="list-cell list-cell--transparent">
                                                <div className="list-cell__icon">
                                                    {
                                                        subItem.image &&
                                                        <img
                                                            src={subItem.image}
                                                            width="24px"
                                                            height="24px"
                                                            alt={subItem.name}
                                                            style={{ filter: 'var(--icon-main-filter)' }}
                                                        />
                                                    }
                                                </div>
                                                <div className="list-cell__left">
                                                    <div className="list-cell__double">
                                                        <span className={`list-cell__title body-regular ${isActiveSubmenu(subItem.href) ? 'active' : ''}`}>
                                                            {subItem.name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="list-cell__right">
                                                    <img src={IconArrowRight} alt="arrow" />
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            );
        });
    };

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="tab-bar">
                <ul className="tab-bar__list">
                    <li
                        onClick={handleNavigation({ href: "/casino" })}
                        className="tab-bar__item"
                    >
                        <a
                            className={`tab ${getActiveClass("/casino")}`}
                        >
                            <div className="tab__icon">
                                <img src={ImgFooterCasino} alt="casino" />
                            </div>
                            <div className="tab__title">
                                Casino
                            </div>
                        </a>
                    </li>

                    {/* Live Casino & Sports */}
                    {showFullMenu && (
                        <>
                            <li
                                onClick={handleNavigation({ href: "/live-casino" })}
                                className="tab-bar__item"
                            >
                                <a
                                    className={`tab ${getActiveClass("/live-casino")}`}
                                >
                                    <div className="tab__icon">
                                        <img src={ImgFooterLiveCasino} alt="casino en vivo" />
                                    </div>
                                    <div className="tab__title">
                                        Casino en vivo
                                    </div>
                                </a>
                            </li>

                            <li
                                onClick={handleNavigation({ href: "/sports" })}
                                className="tab-bar__item"
                            >
                                <a
                                    className={`tab ${getActiveClass("/sports")}`}
                                >
                                    <div className="tab__icon">
                                        <img src={ImgFooterSports} alt="sports" />
                                    </div>
                                    <div className="tab__title">
                                        Deportes
                                    </div>
                                </a>
                            </li>
                        </>
                    )}

                    <li
                        onClick={toggleSidebar}
                        className="tab-bar__item"
                    >
                        <a
                            className={`tab ${isSidebarExpanded ? "tab--active tab--active-route" : ""}`}
                        >
                            <div className="tab__icon">
                                <img src={ImgMenu} alt="menu" />
                            </div>
                            <div className="tab__title">
                                Menú
                            </div>
                        </a>
                    </li>
                </ul>
            </nav>

            <>
                <div className="shadow__wrapper hidden" onClick={toggleSidebar}></div>

                <div className={`menu ${isSidebarExpanded ? "menu--visible menu--active" : ""}`}>
                    <header className="menu__header navigation-bar">
                        <h2 className="navigation-bar__left title-1-semi-bold">
                            <i18n-t t="common-dictionary:Menu">Menú</i18n-t>
                        </h2>
                        <button
                            className="navigation-bar__right button"
                            type="button"
                            onClick={toggleSidebar}
                        >
                            <img src={ImgClose} alt="Close menu" />
                        </button>
                    </header>
                    <div className="menu__wrapper">
                        {renderMenuItems()}
                    </div>
                </div>
            </>
        </>
    );
};

export default MobileFooter;