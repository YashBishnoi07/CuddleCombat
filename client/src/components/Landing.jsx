import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.bgWrapper}>
        <div className={styles.parallaxBg}></div>
        <div className={styles.noiseOverlay}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.icon}>🥂💖</span>
          <h1 className={styles.title}>CuddleCombat</h1>
        </div>
        <p className={styles.tagline}>Stop scrolling. Start watching.</p>
        
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/setup')}>
            Create a Room
          </button>
          <button className={styles.ghostBtn} onClick={() => {
            const code = prompt('Enter Room Code:');
            if (code) navigate(`/room/${code.toUpperCase()}`);
          }}>
            Join with a code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
