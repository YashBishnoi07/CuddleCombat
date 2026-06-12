import React from 'react';
import { animated } from '@react-spring/web';
import { useSwipe } from '../hooks/useSwipe';
import styles from './SwipeDeck.module.css';

const SwipeCard = ({ movie, onSwipeLeft, onSwipeRight, isTop, style, blindSwipe }) => {
  const { x, y, rot, scale, bind, isGone } = useSwipe({
    onSwipeLeft: () => onSwipeLeft(movie),
    onSwipeRight: () => onSwipeRight(movie)
  });

  if (isGone && isTop) return null;

  return (
    <animated.div
      className={styles.cardContainer}
      style={{
        ...style,
        x: isTop ? x : style.x,
        y: isTop ? y : style.y,
        scale: isTop ? scale : style.scale,
        rotateZ: isTop ? rot : 0,
        zIndex: isTop ? 10 : style.zIndex
      }}
      {...(isTop ? bind() : {})}
    >
      <div 
        className={styles.poster} 
        style={{ 
          backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
          filter: blindSwipe ? 'blur(20px) grayscale(50%)' : 'none',
          transform: blindSwipe ? 'scale(1.2)' : 'none' // Prevent blurred edges
        }}
      >
        <div className={styles.gradientOverlay}></div>
        
        {isTop && (
          <>
            <animated.div 
              className={`${styles.stamp} ${styles.nopeStamp}`}
              style={{ opacity: x.to(val => (val < -50 ? Math.min(1, Math.abs(val) / 100) : 0)) }}
            >
              NOPE
            </animated.div>
            <animated.div 
              className={`${styles.stamp} ${styles.likeStamp}`}
              style={{ opacity: x.to(val => (val > 50 ? Math.min(1, Math.abs(val) / 100) : 0)) }}
            >
              LIKE
            </animated.div>
          </>
        )}

        <div className={styles.footer} style={{ zIndex: 2 }}>
          {blindSwipe ? (
            <>
              <h2 className={styles.movieTitle}>Mystery Movie</h2>
              <p className={styles.blindOverview}>{movie.overview.length > 150 ? movie.overview.substring(0, 150) + '...' : movie.overview}</p>
            </>
          ) : (
            <>
              <h2 className={styles.movieTitle}>{movie.title}</h2>
              <div className={styles.metaRow}>
                <span>{movie.release_date?.substring(0,4)}</span>
                <span className={styles.dot}>·</span>
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </animated.div>
  );
};

export default SwipeCard;
