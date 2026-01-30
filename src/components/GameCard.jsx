import { useContext } from 'react';
import { AppContext } from '../AppContext';

const GameCard = (props) => {
  const { contextData } = useContext(AppContext);

  const handleGameClick = (e) => {
    e.stopPropagation();

    const gameData = props.game || {
      id: props.id || props.gameId,
      name: props.title,
      image_local: props.imageSrc?.includes(contextData?.cdnUrl)
        ? props.imageSrc.replace(contextData.cdnUrl, '')
        : null,
      image_url: props.imageSrc?.includes(contextData?.cdnUrl)
        ? null
        : props.imageSrc
    };

    if (props.onGameClick) {
      props.onGameClick(gameData);
    }
  };

  return (
    <article className="game-card" onClick={handleGameClick}>
      <div className="game-card__box">
        <div className="game-card__button button button--low button--primary">
          <i18n-t t="casino-lobby:Play">Jugar</i18n-t>
        </div>
        {
          props.imageSrc && 
          <img
            className="game-card__image"
            src={props.imageSrc}
            alt={props.title}
            loading="lazy"
            fetchPriority="high"
          />
        }
      </div>
      <div className="game-card__text-content">
        <h4 className="game-card__title">
          <a className="game-card__link subhead-semi-bold">{props.title}</a>
        </h4>
      </div>
    </article>
  );
};

export default GameCard;
