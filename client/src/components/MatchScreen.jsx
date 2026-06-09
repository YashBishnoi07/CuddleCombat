import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { animated, useSpring } from '@react-spring/web';
import styles from './MatchScreen.module.css';

const MatchScreen = ({ matchData, onKeepSwiping }) => {
  const movie = matchData.movieData;

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF4458', '#F5C842', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF4458', '#F5C842', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4458', '#F5C842', '#ffffff']
    });

    frame();
  }, []);

  const bgSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 500 }
  });

  const badgeSpring = useSpring({
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    delay: 300,
    config: { tension: 180, friction: 12 }
  });

  const contentSpring = useSpring({
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1 },
    delay: 500
  });

  return (
    <animated.div className={styles.container} style={bgSpring}>
      <div 
        className={styles.backgroundBlur} 
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie?.poster_path})` }}
      ></div>
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <animated.div className={styles.badgeContainer} style={badgeSpring}>
          <div className={styles.pulseRing}></div>
          <h1 className={styles.matchText}>🎬 It's a Match!</h1>
        </animated.div>

        <animated.div className={styles.movieInfo} style={contentSpring}>
          <img 
            className={styles.poster} 
            src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`} 
            alt={movie?.title} 
          />
          <h2 className={styles.title}>{movie?.title}</h2>
          <p className={styles.tagline}>Tonight's movie is decided.</p>
          
          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent((movie?.title || '') + ' trailer')}`, '_blank')}>
              ▶ Watch Trailer
            </button>
            <button className={styles.ghostBtn} onClick={onKeepSwiping}>
              Keep Swiping
            </button>
          </div>
        </animated.div>
      </div>
    </animated.div>
  );
};

export default MatchScreen;
