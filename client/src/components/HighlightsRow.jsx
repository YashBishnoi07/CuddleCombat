import React, { useState, useEffect } from 'react';
import StoryViewer from './StoryViewer';
import styles from './HighlightsRow.module.css';

const HighlightsRow = () => {
  const [highlightChunks, setHighlightChunks] = useState([]);
  const [activeStoryGroup, setActiveStoryGroup] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('cuddle_combat_highlights');
    if (saved) {
      const allHighlights = JSON.parse(saved);
      // Chunk into groups of 7
      const chunks = [];
      for (let i = 0; i < allHighlights.length; i += 7) {
        chunks.push(allHighlights.slice(i, i + 7));
      }
      setHighlightChunks(chunks);
    }
  }, []);

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
