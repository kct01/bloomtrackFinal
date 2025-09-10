import React from 'react';
import { useApp } from '../../context/AppContext';
import ResourceLibrary from '../../components/resources/ResourceLibrary';
import styles from './Resources.module.css';

function Resources() {
  const { user, pregnancyData } = useApp();

  return (
    <div className={styles.resourcesPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.pageTitle}>📚 Pregnancy Resources</h1>
          <p className={styles.pageSubtitle}>
            Expert advice and information to support your pregnancy journey, {user.name || 'Beautiful'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className={styles.quickStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Week {pregnancyData.currentWeek}</span>
            <span className={styles.statLabel}>Current</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{40 - pregnancyData.currentWeek}</span>
            <span className={styles.statLabel}>Weeks Left</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{Math.ceil((40 - pregnancyData.currentWeek) / 4)}</span>
            <span className={styles.statLabel}>Months Left</span>
          </div>
        </div>
      </div>

      {/* Full Resource Library */}
      <ResourceLibrary weekSpecific={false} currentWeek={pregnancyData.currentWeek} />

      {/* Help Section */}
      <div className={styles.helpSection}>
        <div className={styles.helpCard}>
          <h3 className={styles.helpTitle}>🤗 Need More Support?</h3>
          <p className={styles.helpText}>
            Our resources are here to guide you, but remember that every pregnancy is unique. 
            Always consult with your healthcare provider for personalized advice.
          </p>
          <div className={styles.helpActions}>
            <button className={styles.helpButton}>
              📞 Emergency Contacts
            </button>
            <button className={styles.helpButton}>
              💬 Join Community
            </button>
            <button className={styles.helpButton}>
              👩‍⚕️ Find Care Provider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;