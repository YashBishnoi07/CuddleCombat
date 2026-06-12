import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HighlightsRow from './HighlightsRow';
import styles from './TabPlaceholder.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const MatchesTab = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [watchRes, likesRes] = await Promise.all([
          axios.get(`${API_URL}/api/user/watchlist`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/user/likes`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setWatchlist(watchRes.data);
        setLikes(likesRes.data);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <HighlightsRow />
      
      {watchlist.length === 0 ? (
        <div className={styles.emptyWatchlist}>
          <h1>Watchlist</h1>
          <p>Your saved matches will appear here...</p>
        </div>
      ) : (
        <div className={styles.watchlistSection}>
          <h2>Your Watchlist</h2>
          <div className={styles.watchlistGrid}>
            {watchlist.map((movie, idx) => (
              <div key={`watch-${movie.id}-${idx}`} className={styles.watchlistItem}>
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                  alt={movie.title} 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {likes.length > 0 && (
        <div className={styles.watchlistSection} style={{ marginTop: '24px' }}>
          <h2>Movies You Liked</h2>
          <div className={styles.watchlistGrid}>
            {likes.map((like, idx) => (
              <div key={`like-${like._id || idx}`} className={styles.watchlistItem}>
                <img 
                  src={`https://image.tmdb.org/t/p/w200${like.movieData?.poster_path}`} 
                  alt="Liked Movie" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchesTab;
