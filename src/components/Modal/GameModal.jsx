import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NavigationContext } from "../Layout/NavigationContext";
import Footer from "../Layout/Footer";
import IconArrowLeft from "/src/assets/svg/arrow-left.svg";
import IconFullScreen from "/src/assets/svg/full-screen.svg";

const GameModal = (props) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const gameViewContainerRef = useRef(null);
  const { setShowFullDivLoading } = useContext(NavigationContext);

  useEffect(() => {
    const gameViewContainer = document.querySelector(".game-launch__container");
    if (gameViewContainer) {
      gameViewContainerRef.current = gameViewContainer;
    }
  }, []);

  useEffect(() => {
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (props.isMobile) {
        window.location.href = props.gameUrl;
      } else {
        let gameViewContainer = gameViewContainerRef.current;
        if (!gameViewContainer) {
          gameViewContainer = document.querySelector(".game-launch__container");
          gameViewContainerRef.current = gameViewContainer;
        }

        if (gameViewContainer) {
          gameViewContainer.classList.remove("d-none");
        } else {
          console.warn("Game view container not found");
        }

        setUrl(props.gameUrl);
        setIframeLoaded(false);
      }
    }
  }, [props.gameUrl, props.isMobile]);

  useEffect(() => {
    return () => {
      const gameViewContainer = gameViewContainerRef.current;
      if (gameViewContainer) {
        gameViewContainer.classList.add("d-none");
        gameViewContainer.classList.remove("fullscreen");
        gameViewContainer.classList.remove("with-background");
      }

      if (isFullscreen) {
        exitFullscreen();
      }

      setUrl(null);
      setIframeLoaded(false);
      setIsFullscreen(false);
    };
  }, []);

  const toggleFullScreen = () => {
    const gameWindow = document.querySelector(".game-launch__container") || document.documentElement;

    if (!isFullscreen) {
      enterFullscreen(gameWindow);
    } else {
      exitFullscreen();
    }
  };

  const enterFullscreen = (element) => {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }

    const gameViewContainer = gameViewContainerRef.current;
    if (gameViewContainer) {
      gameViewContainer.classList.add("fullscreen");
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    const gameViewContainer = gameViewContainerRef.current;
    if (gameViewContainer) {
      gameViewContainer.classList.remove("fullscreen");
    }
    setIsFullscreen(false);
  };

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setIsFullscreen(false);
      const gameViewContainer = gameViewContainerRef.current;
      if (gameViewContainer) {
        gameViewContainer.classList.remove("fullscreen");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setShowFullDivLoading(false);
  };

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isFullscreen) {
      exitFullscreen();
    }

    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div className="lca-gv d-flex lca-wrapper">
      <section class="section section--top game-launch" data-gamelaunch-target="fullscreen">
        <header class="navigation-bar" data-screen-area-detail="game_header">
          <button class="navigation-bar__left" type="button" aria-label="Go back" onClick={() => handleClose()}>
            <img src={IconArrowLeft} />
          </button>
          <div class="navigation-bar__center">
            <h1 class="navigation-bar__title body-semi-bold">
              <i18n-t t="casino-lobby:Joker's Jewels">{props.gameName}</i18n-t>
            </h1>
          </div>
          <div class="navigation-bar__right navigation-bar__right--group">
            <button class="button game-launch__fullscreen-toggle" type="button" data-gamelaunch-trigger="fullscreen-toggle">
              <img src={IconFullScreen} onClick={toggleFullScreen} />
            </button>
          </div>
        </header>
        <div className="d-none game-launch__container gradient lca-gv-main open">
          {url && (
            <iframe
              ref={iframeRef}
              allow="camera;microphone;fullscreen *; autoplay"
              src={url}
              onLoad={handleIframeLoad}
              className="game-launch__frame"
              style={{
                border: 'none',
                width: '100%',
                height: iframeLoaded ? '100%' : '0px',
                display: iframeLoaded ? 'block' : 'none'
              }}
              title={props.gameName || "Casino Game"}
            ></iframe>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default GameModal;