import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HighlightsRow />
      
      {watchlist.length === 0 ? (
        <div className={styles.emptyWatchlist}>
          <h1>Watchlist</h1>
          <p>Your saved matches will appear here...</p>
        </div>
      ) : (
        <motion.div 
          className={styles.watchlistSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Your Watchlist</h2>
          <div className={styles.watchlistGrid}>
            {watchlist.map((movie, idx) => (
              <motion.div 
                key={`watch-${movie.id}-${idx}`} 
                className={styles.watchlistItem}
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                  alt={movie.title} 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {likes.length > 0 && (
        <motion.div 
          className={styles.watchlistSection} 
          style={{ marginTop: '24px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Movies You Liked</h2>
          <div className={styles.watchlistGrid}>
            {likes.map((like, idx) => (
              <motion.div 
                key={`like-${like._id || idx}`} 
                className={styles.watchlistItem}
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w200${like.movieData?.poster_path}`} 
                  alt="Liked Movie" 
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MatchesTab;
