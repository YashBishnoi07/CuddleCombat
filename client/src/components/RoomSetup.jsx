import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import styles from './RoomSetup.module.css';

const SERVICES = ['Netflix', 'Prime Video', 'Disney+ Hotstar', 'SonyLIV', 'JioCinema', 'ZEE5', 'Hulu', 'Max', 'Crunchyroll'];
const GENRES = [
  { label: 'Action', emoji: '🎬' },
  { label: 'Comedy', emoji: '😂' },
  { label: 'Horror', emoji: '💀' },
  { label: 'Romance', emoji: '💕' },
  { label: 'Sci-Fi', emoji: '🧪' },
  { label: 'Drama', emoji: '🎭' }
];

const RoomSetup = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState(new Set());
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [roomCode, setRoomCode] = useState('');

  const toggleService = (s) => {
    const newSet = new Set(selectedServices);
    if (newSet.has(s)) newSet.delete(s);
    else newSet.add(s);
    setSelectedServices(newSet);
  };

  const toggleGenre = (g) => {
    const newSet = new Set(selectedGenres);
    if (newSet.has(g)) newSet.delete(g);
    else newSet.add(g);
    setSelectedGenres(newSet);
  };

  const handleGenerate = () => {
    const code = `COUCH-${nanoid(4).toUpperCase()}`;
    setRoomCode(code);
    
    // Save preferences to localStorage to be read by the Swipe Deck
    const prefs = {
      services: Array.from(selectedServices).join(','),
      genres: Array.from(selectedGenres).join(',')
    };
    localStorage.setItem(`prefs_${code}`, JSON.stringify(prefs));

    // Copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }

    setTimeout(() => {
      navigate(`/room/${code}`);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sheet}>
        <h2 className={styles.title}>Room Setup</h2>
        
        <div className={styles.section}>
          <h3 className={styles.subtitle}>What are you watching on?</h3>
          <div className={styles.chipRow}>
            {SERVICES.map(s => (
              <button 
                key={s} 
                className={`${styles.chip} ${selectedServices.has(s) ? styles.activeChip : ''}`}
                onClick={() => toggleService(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Any mood tonight?</h3>
          <div className={styles.genreGrid}>
            {GENRES.map(g => (
              <button 
                key={g.label} 
                className={`${styles.genrePill} ${selectedGenres.has(g.label) ? styles.activePill : ''}`}
                onClick={() => toggleGenre(g.label)}
              >
                <span className={styles.emoji}>{g.emoji}</span>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {roomCode ? (
          <div className={styles.codeContainer}>
            <p className={styles.codeLabel}>Room Code Copied!</p>
            <div className={styles.codePill}>{roomCode}</div>
          </div>
        ) : (
          <button className={styles.cta} onClick={handleGenerate}>
            Generate Room Link
          </button>
        )}
      </div>
    </div>
  );
};

export default RoomSetup;
