import React, { useEffect, useRef } from 'react';
import styles from './VetoOverlay.module.css';

const VetoOverlay = ({ onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-play the video when mounted
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Video autoplay blocked:', e));
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // Overlay lasts 4.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.shatterContainer}>
        {/* Shards for CSS animation */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`${styles.shard} ${styles[`shard${i + 1}`]}`}></div>
        ))}
      </div>
      
      <div className={styles.videoContainer}>
        <video 
          ref={videoRef}
          src="/veto.mp4" 
          className={styles.video}
          playsInline
        />
        <h1 className={styles.vetoText}>VETOED!</h1>
      </div>
    </div>
  );
};

export default VetoOverlay;
