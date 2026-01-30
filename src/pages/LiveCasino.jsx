import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/Home/Slideshow";
import GameModal from "../components/Modal/GameModal";
import HotGameSlideshow from "../components/Home/HotGameSlideshow";
import ProviderContainer from "../components/ProviderContainer";
import Footer from "../components/Layout/Footer";
import LoginModal from "../components/Modal/LoginModal";
import LoadApi from "../components/Loading/LoadApi";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const pageTitle = "Casino en Vivo";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const originalCategoriesRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const { isMobile } = useOutletContext();
  const hasFetchedContentRef = useRef(false);
  const prevHashRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedCategoryRef = useRef(null);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    hasFetchedContentRef.current = false;
    lastLoadedCategoryRef.current = null;
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setCategories([]);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      const homeCategory = {
        name: "Lobby",
        code: "home",
        id: 0,
        table_name: "apigames_categories"
      };
      const updatedCategories = [homeCategory, ...(result.data.categories || [])];
      setCategories(updatedCategories);
      if (!originalCategoriesRef.current || originalCategoriesRef.current.length === 0) {
        originalCategoriesRef.current = updatedCategories;
      }
      setSelectedProvider(null);
      setPageData(result.data);
      const firstFiveCategories = updatedCategories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      setActiveCategory(homeCategory);
      setSelectedCategoryIndex(0);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    if (!categoryId || !tableName) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
      return;
    }
    const pageSize = 100;
    const groupCode = pageGroupCode || pageData.page_group_code;
    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id ? "&provider=" + selectedProvider.id : "");

    callApi(contextData, "GET", apiUrl, (result) => callbackFetchContentForCategory(result, category, categoryIndex), null);
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });

      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    }
  };

  useEffect(() => {
    if (categories.length === 0) return;

    const hash = location.hash;

    const handleHashNavigation = () => {
      setSelectedProvider(null);

      if (!hash || hash === "#home") {
        setActiveCategory(categories[0]);
        setSelectedCategoryIndex(0);
        setGames([]);

        setFirstFiveCategoriesGames([]);
        const firstFiveCategories = categories.slice(1, 6);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
          });
        } else {
          setIsLoadingGames(false);
        }

        lastLoadedCategoryRef.current = null;
        return;
      }

      const categoryCode = hash.substring(1);
      const category = categories.find(cat => cat.code === categoryCode);

      if (category) {
        const categoryIndex = categories.indexOf(category);
        setActiveCategory(category);
        setSelectedCategoryIndex(categoryIndex);
        setSelectedProvider(category)

        setGames([]);
        setFirstFiveCategoriesGames([]);

        fetchContent(category, category.id, category.table_name, categoryIndex, true);
        lastLoadedCategoryRef.current = category.code;
      }
    };

    // Only execute if hash has changed
    if (prevHashRef.current !== hash || !hasFetchedContentRef.current) {
      handleHashNavigation();
      prevHashRef.current = hash;
      hasFetchedContentRef.current = true;
    }
  }, [categories, location.hash, location.search]);

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    if (!categoryId || !tableName) {
      if (category.code === "home") {
        const pageSize = 30;
        setIsLoadingGames(true);
        if (resetCurrentPage) {
          pageCurrent = 0;
          setGames([]);
        }
        const apiUrl =
          "/get-content?page_group_type=categories&page_group_code=" +
          pageData.page_group_code +
          "&page=" +
          pageCurrent +
          "&length=" +
          pageSize;
        callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
        return;
      }
      setIsLoadingGames(false);
      return;
    }
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
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
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleProviderSelect = (provider, index = 0) => {
    if (categories.length > 0 && provider) {
      if (provider.code === "home") {
        setSelectedProvider(null);
        setActiveCategory(provider);
        setSelectedCategoryIndex(0);
        setGames([]);
        setFirstFiveCategoriesGames([]);
        const firstFiveCategories = categories.slice(1, 6);
        if (firstFiveCategories.length > 0) {
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
          });
        } else {
          setIsLoadingGames(false);
        }
        navigate("/live-casino#home");
        lastLoadedCategoryRef.current = null;
      } else {
        setSelectedProvider(provider);
        const providerIndex = categories.findIndex(cat => cat.id === provider.id);
        setActiveCategory(provider);
        setSelectedCategoryIndex(providerIndex !== -1 ? providerIndex : index);
        fetchContent(provider, provider.id, provider.table_name, providerIndex !== -1 ? providerIndex : index, true);
        lastLoadedCategoryRef.current = provider.code;
      }
    } else if (!provider && categories.length > 0) {
      const firstCategory = categories[0];
      setSelectedProvider(null);
      setActiveCategory(firstCategory);
      setSelectedCategoryIndex(0);
      setGames([]);
      setFirstFiveCategoriesGames([]);
      const firstFiveCategories = categories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = null;
    }
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
          isMobile={isMobile}
        />
      )}

      {shouldShowGameModal && selectedGameId !== null && (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
          provider={selectedProvider?.name || "Casino"}
        />
      )}

      {!shouldShowGameModal && (
        <>
          {
            selectedProvider && selectedProvider.name ?
              <>
                <div className="section section--top">
                  <header className="navigation-bar ">
                    <button
                      className="navigation-bar__left"
                      type="button"
                      aria-label="Go back"
                      onClick={() => {
                        setSelectedProvider(null);
                      }}
                    >
                      <svg-image glyph="back_ios" width="24px" height="24px" fill="var(--icon-main)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="var(--icon-main)"><path d="M13.3 20.7l-8-8c-.4-.4-.4-1 0-1.4l8-8c.4-.4 1-.4 1.4 0s.4 1 0 1.4L7.4 12l7.3 7.3c.4.4.4 1 0 1.4s-1 .4-1.4 0z"></path></svg>
                      </svg-image>
                    </button>
                    <div className="navigation-bar__center navigation-bar__center--double">
                      <h1 className="navigation-bar__title body-semi-bold">
                        <i18n-t t="casino-lobby:Slots" className="navigation-bar__title body-semi-bold">Casino en vivo</i18n-t>
                      </h1>
                      {
                        selectedProvider.name &&
                        <p className="navigation-bar__subtitle caption-1-regular">
                          <i18n-t>{selectedProvider.name}</i18n-t>
                        </p>
                      }
                    </div>
                  </header>
                </div>
                <div className="games-list">
                  {games.map((game) => (
                    <GameCard
                      key={game.id}
                      id={game.id}
                      provider={activeCategory?.name || "Casino"}
                      title={game.name}
                      imageSrc={
                        game.image_local !== null
                          ? contextData.cdnUrl + game.image_local
                          : game.image_url
                      }
                      game={game}
                      onGameClick={(g) => {
                        if (isLogin) {
                          launchGame(g, "slot", "tab");
                        } else {
                          handleLoginClick();
                        }
                      }}
                    />
                  ))}
                </div>
                
                {isLoadingGames && <LoadApi />}

                <div className="load-more">
                  <button className="button button--low button--primary" type="button" onClick={loadMoreGames}>
                    <i18n-t t="casino-lobby:Load More">Cargar más</i18n-t>
                  </button>

                  <div className="load-more__loader">
                    <div className="page-loader">
                      <svg className="loader loader--spin" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5376 20.4833H5.50435C2.41417 20.4833 0.243672 17.4402 1.2481 14.5179L4.74475 4.3497C5.02254 3.54302 5.78214 3 6.6359 3H20.8313C21.8592 3 22.5827 4.0107 22.2516 4.98374L17.4303 19.1273C17.1541 19.9371 16.3929 20.4817 15.536 20.4817L15.5376 20.4833Z" fill="#B9E113"></path>
                        <path d="M13.8899 4.92567L4.62883 12.5467C4.48131 12.6692 4.56763 12.9093 4.75909 12.9093H9.08283C9.22251 12.9093 9.32138 13.0474 9.27587 13.1808L7.66722 17.8341C7.59973 18.0287 7.83044 18.1888 7.98895 18.0585L17.0523 10.6478C17.2014 10.5269 17.1151 10.2852 16.9236 10.2852H12.6752C12.534 10.2852 12.4351 10.1455 12.4822 10.0121L14.2117 5.15323C14.2807 4.95863 14.05 4.79541 13.8899 4.92724V4.92567Z" fill="#0A234F"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </> : <>
                <div className="section section--top">
                  <header className="navigation-bar ">
                    <button
                      className="navigation-bar__left"
                      type="button"
                      aria-label="Go back"
                      onClick={() => {
                        setSelectedProvider(null);
                      }}
                    >
                      <svg-image glyph="back_ios" width="24px" height="24px" fill="var(--icon-main)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="var(--icon-main)"><path d="M13.3 20.7l-8-8c-.4-.4-.4-1 0-1.4l8-8c.4-.4 1-.4 1.4 0s.4 1 0 1.4L7.4 12l7.3 7.3c.4.4.4 1 0 1.4s-1 .4-1.4 0z"></path></svg>
                      </svg-image>
                    </button>
                    <div className="navigation-bar__center navigation-bar__center--double">
                      <h1 className="navigation-bar__title body-semi-bold">
                        <i18n-t t="casino-lobby:Slots" className="navigation-bar__title body-semi-bold">Casino en vivo</i18n-t>
                      </h1>
                    </div>
                  </header>
                  <div className="promo-bar section section--top">
                    <Slideshow />
                  </div>
                  <ProviderContainer
                    categories={categories}
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                    onProviderSelect={handleProviderSelect}
                  />
                </div>

                <>
                  {firstFiveCategoriesGames.map((entry, catIndex) => {
                    if (!entry || !entry.games) return null;

                    return (
                      <HotGameSlideshow
                        key={entry?.category?.id || catIndex}
                        games={entry.games.slice(0, 30)}
                        name={entry?.category?.name}
                        title={entry?.category?.name}
                        slideshowKey={entry?.category?.id}
                        loadMoreContent={() =>
                          loadMoreContent(entry.category, catIndex)
                        }
                        onGameClick={(g) => {
                          if (isLogin) {
                            launchGame(g, "slot", "tab");
                          } else {
                            handleLoginClick();
                          }
                        }}
                      />
                    );
                  })}
                </>

                {isLoadingGames && <LoadApi />}
              </>
          }

          <Footer />
        </>
      )}
    </>
  );
};

export default LiveCasino;