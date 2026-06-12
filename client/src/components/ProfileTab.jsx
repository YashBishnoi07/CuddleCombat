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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.avatar} onClick={() => setShowAvatarSelect(!showAvatarSelect)}>
          {user?.avatar || user?.username?.charAt(0).toUpperCase() || '👤'}
        </div>
        <h2>{user?.username}</h2>
      </div>

      {showAvatarSelect && (
        <div className={styles.avatarSelectSection}>
          <h3 className={styles.sectionTitle}>Choose your Avatar</h3>
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
