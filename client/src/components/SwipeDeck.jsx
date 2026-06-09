import React, { useEffect, useState } from 'react';
import { useTMDB } from '../hooks/useTMDB';
import SwipeCard from './SwipeCard';
import MovieDetailDrawer from './MovieDetailDrawer';
import styles from './SwipeDeck.module.css';

const SwipeDeck = ({ roomId, emitSwipe, partnerConnected }) => {
  const { movies, fetchMovies, loading } = useTMDB();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const prefsStr = localStorage.getItem(`prefs_${roomId}`);
    const prefs = prefsStr ? JSON.parse(prefsStr) : { services: '', genres: '' };
    fetchMovies(prefs, 1);
  }, [roomId, fetchMovies]);

  useEffect(() => {
    if (!loading && movies.length > 0 && currentIndex > movies.length - 5) {
      const prefsStr = localStorage.getItem(`prefs_${roomId}`);
      const prefs = prefsStr ? JSON.parse(prefsStr) : { services: '', genres: '' };
      fetchMovies(prefs);
    }
  }, [currentIndex, movies.length, roomId, fetchMovies, loading]);

  const handleSwipeLeft = (movie) => {
    emitSwipe('left', movie.id, movie);
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeRight = (movie) => {
    emitSwipe('right', movie.id, movie);
    setCurrentIndex(prev => prev + 1);
  };

  const currentMovie = movies[currentIndex];

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <div className={styles.partnerStatus}>
          <div className={`${styles.pulseDot} ${partnerConnected ? styles.green : styles.orange}`}></div>
          {partnerConnected ? 'Partner also swiping...' : 'Partner thinking...'}
        </div>
      </div>

      <div className={styles.deckArea}>
        {movies.length === 0 && loading ? (
          <div className={styles.loadingState}>Loading movies...</div>
        ) : movies.length > 0 && currentIndex < movies.length ? (
          movies.slice(currentIndex, currentIndex + 3).reverse().map((movie, idx, arr) => {
            const isTop = idx === arr.length - 1;
            const depth = arr.length - 1 - idx;
            
            const style = {
              scale: 1 - (depth * 0.05),
              y: depth * 25, // Using pixels for smooth spring interpolation
              zIndex: 10 - depth
            };

            return (
              <SwipeCard 
                key={movie.id} 
                movie={movie} 
                isTop={isTop}
                style={style}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.popcornIcon}>🍿</div>
            <p>You've seen everything! Refresh for more?</p>
          </div>
        )}
      </div>

      <div className={styles.actionRow}>
        <button 
          className={styles.nopeBtn} 
          onClick={() => currentMovie && handleSwipeLeft(currentMovie)}
        >✕</button>
        <button 
          className={styles.infoBtn} 
          onClick={() => currentMovie && setSelectedMovie(currentMovie)}
        >ⓘ</button>
        <button 
          className={styles.likeBtn} 
          onClick={() => currentMovie && handleSwipeRight(currentMovie)}
        >♥</button>
      </div>

      {movies.length > 0 && (
        <div className={styles.progress}>
          {currentIndex + 1} of {movies.length} movies
        </div>
      )}

      {selectedMovie && (
        <MovieDetailDrawer 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
          onNope={() => {
            handleSwipeLeft(selectedMovie);
            setSelectedMovie(null);
          }}
          onLike={() => {
            handleSwipeRight(selectedMovie);
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
};

export default SwipeDeck;
