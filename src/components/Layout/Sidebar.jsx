import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import ImgCasino from "/src/assets/svg/blue-casino.svg";
import ImgLiveCasino from "/src/assets/svg/blue-live-casino.svg";
import ImgSports from "/src/assets/svg/blue-sports.svg";
import ImgProfile from "/src/assets/svg/profile.svg";
import ImgLogout from "/src/assets/svg/logout.svg";
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

const Sidebar = ({ isSlotsOnly, isMobile, supportParent, openSupportModal, handleLogoutClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarExpanded, toggleSidebar } = useContext(LayoutContext);
    const { contextData } = useContext(AppContext);

    const [expandedMenus, setExpandedMenus] = useState([]);
    const [liveCasinoMenus, setLiveCasinoMenus] = useState([]);
    const [hasFetchedLiveCasino, setHasFetchedLiveCasino] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);

    const iconRefs = useRef({});
    const popoverRef = useRef(null);
    const hoverTimeoutRef = useRef(null);

    const isLoggedIn = !!contextData?.session;

    const toggleMenu = (menuId) => {
        if (!isSidebarExpanded) return;
        setExpandedMenus((prev) =>
            prev.includes(menuId)
                ? prev.filter((item) => item !== menuId)
                : [...prev, menuId]
        );
    };

    const isMenuExpanded = (menuId) => expandedMenus.includes(menuId);

    useEffect(() => {
        if (!hasFetchedLiveCasino) {
            callApi(contextData, "GET", "/get-page?page=livecasino", (result) => {
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
            }, null);
        }
    }, [hasFetchedLiveCasino, contextData, isLoggedIn]);

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

    const handleMouseEnter = (itemId, event) => {
        if (!isSidebarExpanded) {
            clearTimeout(hoverTimeoutRef.current);
            const rect = event.currentTarget.getBoundingClientRect();
            setPopoverPosition({
                top: rect.top + window.scrollY,
                left: rect.right + 16,
            });
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredMenu(itemId);
                setIsPopoverVisible(true);
            }, 150);
        }
    };

    const handleMouseLeave = (event) => {
        if (!isSidebarExpanded) {
            clearTimeout(hoverTimeoutRef.current);
            const relatedTarget = event.relatedTarget;
            if (popoverRef.current && popoverRef.current.contains(relatedTarget)) return;

            hoverTimeoutRef.current = setTimeout(() => {
                setIsPopoverVisible(false);
                setHoveredMenu(null);
            }, 100);
        }
    };

    const handlePopoverMouseEnter = () => clearTimeout(hoverTimeoutRef.current);
    const handlePopoverMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setIsPopoverVisible(false);
            setHoveredMenu(null);
        }, 100);
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
        ...(isLoggedIn
            ? [
                {
                    id: "profile",
                    name: "Cuenta",
                    image: ImgProfile,
                    href: "/profile/detail",
                    subItems: [
                        { name: "Ajustes de Cuenta", href: "/profile/detail" },
                        { name: "Historial de transacciones", href: "/profile/transaction" },
                        { name: "Historial de Casino", href: "/profile/history" },
                    ],
                },
            ]
            : []),
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
        ...(isLoggedIn
            ? [
                {
                    id: "logout",
                    name: "Cerrar sesión",
                    image: ImgLogout,
                    href: "#",
                    subItems: [],
                    action: handleLogoutClick,
                },
            ]
            : []),
    ];

    const handleNavigation = (item) => (e) => {
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
                        onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                        onMouseLeave={handleMouseLeave}
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
            <div className="menu__wrapper">
                {renderMenuItems()}
            </div>

            {!isSidebarExpanded && isPopoverVisible && hoveredMenu && (
                <div
                    ref={popoverRef}
                    className="menu-popover"
                    style={{
                        position: 'absolute',
                        top: `${popoverPosition.top}px`,
                        left: `${popoverPosition.left}px`,
                        zIndex: 1000,
                    }}
                    onMouseEnter={handlePopoverMouseEnter}
                    onMouseLeave={handlePopoverMouseLeave}
                >
                    {/* Popover content for the hovered menu */}
                </div>
            )}
        </>
    );
};

export default Sidebar;