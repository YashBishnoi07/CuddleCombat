import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HighlightsRow from './HighlightsRow';
import styles from './TabPlaceholder.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const MatchesTab = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/user/watchlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist(res.data);
      } catch (err) {
        console.error('Failed to fetch watchlist', err);
      }
    };
    fetchWatchlist();
  }, []);

  return (
    <div className={styles.container}>
      <HighlightsRow />
      
      {watchlist.length === 0 ? (
        <div className={styles.emptyWatchlist}>
          <h1>Watchlist</h1>
          <p>Your saved movies will appear here soon...</p>
        </div>
      ) : (
        <div className={styles.watchlistSection}>
          <h2>Your Watchlist</h2>
          <div className={styles.watchlistGrid}>
            {watchlist.map((movie, idx) => (
              <div key={`${movie.id}-${idx}`} className={styles.watchlistItem}>
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                  alt={movie.title} 
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
