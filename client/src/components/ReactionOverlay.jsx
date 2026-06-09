import React, { useEffect, useRef } from 'react';
import styles from './ReactionOverlay.module.css';

const ReactionOverlay = ({ onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Reaction video autoplay blocked:', e));
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 5000); // Overlay lasts 5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={styles.overlay}>
      <div className={styles.videoContainer}>
        <video 
          ref={videoRef}
          src="/reaction.mp4" 
          className={styles.video}
          playsInline
        />
        <h1 className={styles.reactionText}>REVENGE!</h1>
      </div>
    </div>
  );
};

export default ReactionOverlay;
