import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import styles from './ProfileTab.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ProfileTab = () => {
  const { user, setUser } = useContext(AuthContext);
  const [likes, setLikes] = useState([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const [showTopPicksSelect, setShowTopPicksSelect] = useState(false);
  const fileInputRef = React.useRef(null);
  const avatars = ['🦊', '🐼', '🦁', '🐯', '🐰', '🐸', '🐵', '🦄', '🐶', '🐱'];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [likesRes, matchesRes] = await Promise.all([
          axios.get(`${API_URL}/api/user/likes`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/api/user/matches`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setLikes(likesRes.data);
        setMatchesCount(matchesRes.data.length);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      }
    };
    fetchData();
  }, [user]);

  // Calculate Trophies
  const trophies = [];
  if (matchesCount >= 1) trophies.push({ id: 1, icon: '🔥', title: 'First Match', desc: 'Matched with a friend' });
  if (matchesCount >= 10) trophies.push({ id: 2, icon: '🏆', title: 'Cinephile', desc: 'Matched 10 times' });
  if (likes.length >= 20) trophies.push({ id: 3, icon: '🍿', title: 'Swipe Master', desc: 'Liked 20+ movies' });
  
  // Find favorite genre based on likes
  if (likes.length > 0) {
    const genreCounts = {};
    likes.forEach(like => {
      const genres = like.movieData.genre_ids || [];
      genres.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const topGenreId = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
    
    // Add a trophy for having a strong genre preference if they have enough likes
    if (genreCounts[topGenreId] > 5) {
      trophies.push({ id: 4, icon: '🎭', title: 'Genre Specialist', desc: 'You have a clear favorite vibe' });
    }
  }

  const handleAvatarChange = async (avatar) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/user/avatar`, { avatar }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, avatar });
      setShowAvatarSelect(false);
    } catch (err) {
      console.error('Failed to change avatar', err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB to avoid huge DB payloads)
    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      handleAvatarChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTopPickChange = async (movie) => {
    let newPicks = [...(user.topPicks || [])];
    const exists = newPicks.find(p => p.id === movie.id);
    if (exists) {
      newPicks = newPicks.filter(p => p.id !== movie.id);
    } else {
      if (newPicks.length >= 3) return; // Max 3
      newPicks.push(movie);
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/user/top-picks`, { topPicks: newPicks }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...user, topPicks: newPicks });
    } catch (err) {
      console.error('Failed to change top picks', err);
    }
  };

  const renderAvatarContent = () => {
    if (user?.avatar?.startsWith('data:image')) {
      return <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    }
    return user?.avatar || user?.username?.charAt(0).toUpperCase() || '👤';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar} onClick={() => setShowAvatarSelect(!showAvatarSelect)}>
          {renderAvatarContent()}
        </div>
        <h2>{user?.username}</h2>
      </div>

      {showAvatarSelect && (
        <div className={styles.avatarSelectSection}>
          <div className={styles.avatarHeader}>
            <h3 className={styles.sectionTitle}>Choose your Avatar</h3>
            <button className={styles.uploadBtn} onClick={() => fileInputRef.current.click()}>
              Upload Photo
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
            />
          </div>
          <div className={styles.avatarGrid}>
            {avatars.map(a => (
              <div 
                key={a} 
                className={`${styles.avatarOption} ${user?.avatar === a ? styles.selectedAvatar : ''}`}
                onClick={() => handleAvatarChange(a)}
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.topPicksHeader}>
          <h3 className={styles.sectionTitle}>Top Picks</h3>
          {user?.topPicks?.length > 0 && (
            <button className={styles.uploadBtn} onClick={() => setShowTopPicksSelect(!showTopPicksSelect)}>
              {showTopPicksSelect ? 'Done' : 'Edit'}
            </button>
          )}
        </div>

        {(!user?.topPicks || user?.topPicks?.length === 0) && !showTopPicksSelect ? (
          <div className={styles.emptyTopPicks}>
            <p className={styles.emptyText}>Show off your favorite movies!</p>
            <button className={styles.uploadBtn} onClick={() => setShowTopPicksSelect(true)}>Select Top Picks</button>
          </div>
        ) : !showTopPicksSelect ? (
          <div className={styles.topPicksGrid}>
            {user.topPicks.map(movie => (
              <div key={`pick-${movie.id}`} className={styles.topPickCard}>
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              </div>
            ))}
          </div>
        ) : null}

        {showTopPicksSelect && (
          <div className={styles.topPicksSelectionArea}>
            <p className={styles.emptyText} style={{ marginBottom: '12px' }}>
              Select up to 3 movies from your likes ({user?.topPicks?.length || 0}/3)
            </p>
            <div className={styles.likesGrid}>
              {likes.map(like => {
                const movie = like.movieData;
                const isSelected = user?.topPicks?.some(p => p.id === movie.id);
                return (
                  <div 
                    key={`select-${movie.id}`} 
                    className={`${styles.likeSelectCard} ${isSelected ? styles.selectedPick : ''}`}
                    onClick={() => handleTopPickChange(movie)}
                  >
                    <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                    {isSelected && <div className={styles.checkOverlay}>✓</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Trophies</h3>
        {trophies.length === 0 ? (
          <p className={styles.emptyText}>Keep swiping to earn trophies!</p>
        ) : (
          <div className={styles.trophyGrid}>
            {trophies.map(t => (
              <div key={t.id} className={styles.trophyCard}>
                <span className={styles.trophyIcon}>{t.icon}</span>
                <span className={styles.trophyTitle}>{t.title}</span>
                <span className={styles.trophyDesc}>{t.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Movies You Liked</h3>
        <p className={styles.statsText}>{likes.length} total right-swipes</p>
        <div className={styles.likedGrid}>
          {likes.map(like => (
            <div key={like._id} className={styles.likedCard}>
              <img 
                src={`https://image.tmdb.org/t/p/w200${like.movieData.poster_path}`} 
                alt="Movie poster" 
                className={styles.poster}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
