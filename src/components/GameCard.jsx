const GameCard = (props) => {
  return (
    <article className="game-card">
      <div className="game-card__box">
        <div className="game-card__button button button--low button--primary">
          <i18n-t t="casino-lobby:Play">Jugar</i18n-t>
        </div>
        <img
            className="game-card__image"
            src={props.imageSrc}
            alt={props.title}
            loading="lazy"
            fetchPriority="high"
          />
      </div>
      <div className="game-card__text-content">
        <h4 className="game-card__title">
          <a className="game-card__link subhead-semi-bold" onClick={() => onGameClick && onGameClick(game)}>{props.title}</a>
        </h4>
        {/* <div className="game-card__provider caption-1-medium">{props.provider}</div> */}
      </div>
    </article>
  );
};

export default GameCard;
