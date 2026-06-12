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
  const [decade, setDecade] = useState('all');
  const [runtime, setRuntime] = useState('all');
  const [blindSwipe, setBlindSwipe] = useState(false);
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
      genres: Array.from(selectedGenres).join(','),
      decade,
      runtime,
      blindSwipe
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

        <div className={styles.section}>
          <h3 className={styles.subtitle}>Advanced Filters</h3>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Decade</label>
              <select value={decade} onChange={e => setDecade(e.target.value)} className={styles.select}>
                <option value="all">Any</option>
                <option value="2020">2020s</option>
                <option value="2010">2010s</option>
                <option value="2000">2000s</option>
                <option value="1990">1990s</option>
                <option value="1980">1980s</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Max Runtime</label>
              <select value={runtime} onChange={e => setRuntime(e.target.value)} className={styles.select}>
                <option value="all">Any</option>
                <option value="90">90 mins</option>
                <option value="120">2 Hours</option>
                <option value="150">2.5 Hours</option>
              </select>
            </div>
          </div>

          <label className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>Blind Swipe Mode</span>
              <span className={styles.toggleDesc}>Hide posters & titles. Judge by plot only.</span>
            </div>
            <input 
              type="checkbox" 
              checked={blindSwipe} 
              onChange={e => setBlindSwipe(e.target.checked)} 
              className={styles.checkbox}
            />
          </label>
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
