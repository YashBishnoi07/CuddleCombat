import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightsRow from './HighlightsRow';
import StoryViewer from './StoryViewer';
import styles from './MatchesTab.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const MatchesTab = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [likes, setLikes] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null); // 'watchlist' or 'likes'
  const [viewingMovie, setViewingMovie] = useState(null);

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

  const renderGrid = (title, items, isLikes = false) => (
    <motion.div 
      className={styles.fullScreenOverlay}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <div className={styles.fullScreenHeader}>
        <button className={styles.backBtn} onClick={() => setExpandedSection(null)}>←</button>
        <h2>{title}</h2>
      </div>
      <div className={styles.fullScreenGrid}>
        {items.map((item, idx) => {
          const movie = isLikes ? item.movieData : item;
          return (
            <motion.div 
              key={`grid-${movie.id}-${idx}`} 
              className={styles.gridItem}
              whileHover={{ scale: 1.05 }}
              onClick={() => setViewingMovie(movie)}
            >
              <img 
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                alt={movie.title} 
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <HighlightsRow />
      
      <div className={styles.bannersContainer}>
        <motion.div 
          className={styles.sectionBanner}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpandedSection('watchlist')}
        >
          <span>Your Watchlist ({watchlist.length})</span>
          <span>›</span>
        </motion.div>

        <motion.div 
          className={styles.sectionBanner}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpandedSection('likes')}
        >
          <span>Movies You Liked ({likes.length})</span>
          <span>›</span>
        </motion.div>
      </div>

      <AnimatePresence>
        {expandedSection === 'watchlist' && renderGrid('Your Watchlist', watchlist, false)}
        {expandedSection === 'likes' && renderGrid('Movies You Liked', likes, true)}
      </AnimatePresence>

      <AnimatePresence>
        {viewingMovie && (
          <StoryViewer 
            movies={[{ ...viewingMovie, matchDate: new Date() }]} 
            onClose={() => setViewingMovie(null)} 
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default MatchesTab;
