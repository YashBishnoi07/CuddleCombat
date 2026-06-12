import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './BottomNav.module.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide BottomNav if we are inside an active Room (so they have full swipe area)
  // or on the setup/login screens
  if (
    location.pathname.startsWith('/room/') ||
    location.pathname === '/auth' ||
    location.pathname === '/setup'
  ) {
    return null;
  }

  const tabs = [
    { path: '/', label: 'Home' },
    { path: '/matches', label: 'Matches' },
    { path: '/chat', label: 'Chat' },
    { path: '/profile', label: 'Profile' }
  ];

  return (
    <div className={styles.navContainer}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            className={`${styles.navBtn} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
