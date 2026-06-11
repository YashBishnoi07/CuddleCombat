import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import StoryViewer from './StoryViewer';
import styles from './HighlightsRow.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const HighlightsRow = () => {
  const [highlightChunks, setHighlightChunks] = useState([]);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMatches = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${API_URL}/api/user/matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Match documents have `movieData` inside them
        const allHighlights = data.map(m => m.movieData);
        
        const chunks = [];
        for (let i = 0; i < allHighlights.length; i += 7) {
          chunks.push(allHighlights.slice(i, i + 7));
        }
        setHighlightChunks(chunks);
      } catch (err) {
        console.error('Failed to fetch matches', err);
      }
    };
    fetchMatches();
  }, [user]);

  if (highlightChunks.length === 0) return null;

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.memoriesTitle}>Memories</h2>
        <div className={styles.scrollWrapper}>
          {highlightChunks.map((chunk, idx) => {
            const latestMovie = chunk[0]; // The first one in the chunk is the most recent
            return (
              <div 
                key={`chunk-${idx}`} 
                className={styles.highlightCircle}
                onClick={() => setActiveStoryGroup(chunk)}
              >
                <div className={styles.imageRing}>
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${latestMovie.poster_path}`} 
                    alt="Memory Collection" 
                    className={styles.posterImage}
                  />
                </div>
                <span className={styles.movieName}>
                  Vol. {highlightChunks.length - idx}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {activeStoryGroup && (
        <StoryViewer 
          movies={activeStoryGroup} 
          onClose={() => setActiveStoryGroup(null)} 
        />
      )}
    </>
  );
};

export default HighlightsRow;
