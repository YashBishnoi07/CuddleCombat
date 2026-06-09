import React from 'react';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import styles from './MovieDetailDrawer.module.css';

const MovieDetailDrawer = ({ movie, onClose, onNope, onLike }) => {
  const [{ y }, api] = useSpring(() => ({ y: window.innerHeight }));

  React.useEffect(() => {
    api.start({ y: 0, config: { tension: 300, friction: 30 } });
  }, [api]);

  const bind = useDrag(({ active, movement: [, my], velocity: [, vy] }) => {
    if (!active && (my > 100 || vy > 0.5)) {
      api.start({ y: window.innerHeight, onRest: onClose });
    } else {
      api.start({ y: active ? Math.max(0, my) : 0 });
    }
  });

  return (
    <>
      <animated.div 
        className={styles.backdrop} 
        style={{ opacity: y.to([0, window.innerHeight], [1, 0]) }}
        onClick={() => api.start({ y: window.innerHeight, onRest: onClose })}
      />
      <animated.div
        className={styles.drawer}
        style={{ y }}
        {...bind()}
      >
        <div className={styles.dragHandle}></div>
        
        <div className={styles.header}>
          <img 
            className={styles.thumb} 
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
            alt={movie.title} 
          />
          <div className={styles.headerInfo}>
            <h2 className={styles.title}>{movie.title}</h2>
            <p className={styles.meta}>
              {movie.release_date?.substring(0,4)} · ⭐ {movie.vote_average?.toFixed(1)}
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.sectionTitle}>Overview</h3>
          <p className={styles.overview}>{movie.overview}</p>
        </div>

        <div className={styles.footer}>
          <button className={styles.nopeBtn} onClick={onNope}>✕ Nope</button>
          <button className={styles.likeBtn} onClick={onLike}>♥ Like This One</button>
        </div>
      </animated.div>
    </>
  );
};

export default MovieDetailDrawer;
