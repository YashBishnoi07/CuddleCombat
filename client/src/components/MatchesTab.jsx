import React from 'react';
import HighlightsRow from './HighlightsRow';
import styles from './TabPlaceholder.module.css';

const MatchesTab = () => {
  return (
    <div className={styles.container}>
      <HighlightsRow />
      <div className={styles.emptyWatchlist}>
        <h1>Watchlist</h1>
        <p>Your saved movies will appear here soon...</p>
      </div>
    </div>
  );
};

export default MatchesTab;
