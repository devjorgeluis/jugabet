import { useContext, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import LoadApi from "./Loading/LoadApi";
import GameCard from "./GameCard";
import GameModal from "./Modal/GameModal";

import IconSearch from "/src/assets/svg/blue-search.svg";
import IconClose from "/src/assets/svg/close.svg";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;

const SearchInput = () => {
    const { isLogin, isMobile } = useOutletContext();
    const [isSearch, setIsSearch] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [games, setGames] = useState([]);
    const [txtSearch, setTxtSearch] = useState("");
    const searchRef = useRef(null);
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const [gameUrl, setGameUrl] = useState("");
    const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
    const navigate = useNavigate();
    const refGameModal = useRef();

    const { contextData } = useContext(AppContext);

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        if (typeof search === 'function') search(value);
    };

    const handleFocus = () => {
        setSearchFocused(true);
    };

     const handleLoginClick = () => {
        navigate("/login");
    };

    const configureImageSrc = (result) => {
        (result.content || []).forEach((element) => {
            element.imageDataSrc =
                element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
        });
    };

    const search = (e) => {
        const keyword = typeof e === 'string' ? e : (e?.target?.value ?? '');
        setTxtSearch(keyword);
        console.log(keyword);
        

        if (typeof e === 'string') {
            do_search(keyword);
            return;
        }

        if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
            const kw = e.target.value;
            do_search(kw);
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
        setIsSearch(true);
        clearTimeout(searchDelayTimer);

        if (keyword == "") {
            return;
        }

        setGames([]);

        let pageSize = 100;
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
        setIsSearch(false);
        if (result.status === 500 || result.status === 422) {

        } else {
            configureImageSrc(result, true);
            setGames(result.content);
        }
    };

    const launchGame = (game, type, launcher) => {
        if (launcher === "modal") {
            setShouldShowGameModal(true);
        } else {
            setShouldShowGameModal(false);
        }
        selectedGameId = game?.id != null ? game.id : selectedGameId;
        selectedGameType = type != null ? type : selectedGameType;
        selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
        selectedGameName = game?.name || selectedGameName;
        selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game.image_local : selectedGameImg;
        callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
    };

    const callbackLaunchGame = (result) => {
        if (result.status == "0") {
            if (isMobile) {
                try {
                    window.location.href = result.url;
                } catch (err) {
                    try { window.open(result.url, "_blank", "noopener,noreferrer"); } catch (err) { }
                }
                selectedGameId = null;
                selectedGameType = null;
                selectedGameLauncher = null;
                selectedGameName = null;
                selectedGameImg = null;
                setGameUrl("");
                setShouldShowGameModal(false);
                return;
            }

            if (selectedGameLauncher === "tab") {
                try {
                    window.open(result.url, "_blank", "noopener,noreferrer");
                } catch (err) {
                    window.location.href = result.url;
                }
                setShouldShowGameModal(false);
                selectedGameId = null;
                selectedGameType = null;
                selectedGameLauncher = null;
                selectedGameName = null;
                selectedGameImg = null;
                setGameUrl("");
            } else {
                setGameUrl(result.url);
                setShouldShowGameModal(true);
            }
        }
    };

    const closeGameModal = () => {
        selectedGameId = null;
        selectedGameType = null;
        selectedGameLauncher = null;
        selectedGameName = null;
        selectedGameImg = null;
        setGameUrl("");
        setShouldShowGameModal(false);

        try {
            const el = document.getElementsByClassName("game-view-container")[0];
            if (el) {
                el.classList.add("d-none");
                el.classList.remove("fullscreen");
                el.classList.remove("with-background");
            }
            const iframeWrapper = document.getElementById("game-window-iframe");
            if (iframeWrapper) iframeWrapper.classList.add("d-none");
        } catch (err) {
            // ignore DOM errors
        }
        try { getPage('casino'); } catch (e) { }
    };

    return (
        <>
            {shouldShowGameModal && selectedGameId !== null ? (
                <GameModal
                    gameUrl={gameUrl}
                    gameName={selectedGameName}
                    gameImg={selectedGameImg}
                    reload={(gameData) => {
                        if (gameData && gameData.id) {
                            const game = {
                                id: gameData.id,
                                name: selectedGameName,
                                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
                            };
                            launchGame(game, selectedGameType, selectedGameLauncher);
                        } else if (selectedGameId) {
                            const game = {
                                id: selectedGameId,
                                name: selectedGameName,
                                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
                            };
                            launchGame(game, selectedGameType, selectedGameLauncher);
                        }
                    }}
                    launchInNewTab={() => {
                        if (selectedGameId) {
                            const game = {
                                id: selectedGameId,
                                name: selectedGameName,
                                image_local: selectedGameImg?.replace(contextData.cdnUrl, '')
                            };
                            launchGame(game, selectedGameType, "tab");
                        }
                    }}
                    ref={refGameModal}
                    onClose={closeGameModal}
                    isMobile={isMobile}
                    gameId={selectedGameId}
                    gameType={selectedGameType}
                    gameLauncher={selectedGameLauncher}
                />
            ) : <>
                <div className="search">
                    <section className="section section--top section--cover">
                        {
                            selectedGameId === null &&
                            <header className="navigation-bar">
                                <button className="navigation-bar__left" type="button" onClick={() => navigate("/")}>
                                    <img src={IconClose} alt="Close" />
                                </button>

                                <h1 className="navigation-bar__center body-semi-bold">
                                    <i18n-t>Buscar</i18n-t>
                                </h1>
                            </header>
                        }
                        <div className="search__wrapper">
                            <div className="search__field">
                                <fieldset className="text-field">
                                    <input
                                        id="search-input"
                                        type="text"
                                        className="text-field__input"
                                        aria-label="Buscar juegos"
                                        ref={searchRef}
                                        value={txtSearch}
                                        onChange={handleChange}
                                        onKeyUp={search}
                                        onFocus={handleFocus}
                                        onBlur={() => setSearchFocused(false)}
                                    />
                                    <label
                                        className={`text-field__label ${searchFocused || txtSearch ? 'text-field__label--active' : ''}`}
                                        htmlFor="search-input"
                                    >
                                        Buscá tu juego
                                    </label>
                                    <img className="text-field__icon text-field__prepend" src={IconSearch} />
                                </fieldset>
                            </div>
                        </div>
                        {isSearch ? (
                            <div className="load-container">
                                <LoadApi />
                            </div>
                        ) : (
                            games.length > 0 ? (
                                <div className="games-list">
                                    {games.map((game) => (
                                        <GameCard
                                            key={game.id}
                                            id={game.id}
                                            title={game.name}
                                            imageSrc={
                                                game.image_local !== null
                                                    ? contextData.cdnUrl + game.image_local
                                                    : game.image_url
                                            }
                                            game={game}
                                            onGameClick={(g) => {
                                                if (isLogin) {
                                                    launchGame(g, "slot", "modal");
                                                } else {
                                                    handleLoginClick();
                                                }
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : txtSearch !== "" && games.length === 0 && (
                                <div className="search-empty-state empty-state">
                                    <img className="empty-state__icon" src={IconSearch} />
                                    <h3 className="empty-state__title">
                                        <i18n-t>No encontramos nada para ddds</i18n-t>
                                    </h3>
                                    <p className="empty-state__text">
                                        <i18n-t>Asegúrate de que todas las palabras estén escritas correctamente o prueba con palabras clave diferentes</i18n-t>
                                    </p>
                                </div>
                            )
                        )}
                    </section>
                </div>
            </>}
        </>
    );
};

export default SearchInput;