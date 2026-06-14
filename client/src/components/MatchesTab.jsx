import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightsRow from './HighlightsRow';
import MovieDetailsModal from './MovieDetailsModal';
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

  const renderGrid = (items, isLikes = false) => (
    <motion.div 
      className={styles.inlineGridContainer}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      style={{ overflow: 'hidden' }}
    >
      <div className={styles.inlineGrid}>
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
          className={`${styles.sectionBanner} ${expandedSection === 'watchlist' ? styles.activeBanner : ''}`}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpandedSection(expandedSection === 'watchlist' ? null : 'watchlist')}
        >
          <span>Your Watchlist ({watchlist.length})</span>
          <span style={{ transform: expandedSection === 'watchlist' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
        </motion.div>
        <AnimatePresence>
          {expandedSection === 'watchlist' && renderGrid(watchlist, false)}
        </AnimatePresence>

        <motion.div 
          className={`${styles.sectionBanner} ${expandedSection === 'likes' ? styles.activeBanner : ''}`}
          whileTap={{ scale: 0.98 }}
          onClick={() => setExpandedSection(expandedSection === 'likes' ? null : 'likes')}
        >
          <span>Movies You Liked ({likes.length})</span>
          <span style={{ transform: expandedSection === 'likes' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
        </motion.div>
        <AnimatePresence>
          {expandedSection === 'likes' && renderGrid(likes, true)}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {viewingMovie && (
          <MovieDetailsModal 
            movie={viewingMovie} 
            onClose={() => setViewingMovie(null)} 
          />
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default MatchesTab;
