import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { useInAppNotifications } from '../../../context/NotificationContext';
import NotificationCenter from '../NotificationCenter';
import styles from './Header.module.css';

const Header = ({ 
  showUserMenu = true, 
  showNotifications = true 
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const { user, pregnancyData } = useApp();
  const { unreadCount } = useInAppNotifications();
  
  console.log('📊 Header - unreadCount:', unreadCount);

  // Format due date for display
  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'Not set';
    try {
      const date = new Date(dueDate);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'Not set';
    }
  };

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        {/* Logo Section */}
        <Link 
          to="/" 
          className={styles.logo}
          aria-label="BloomTrack - Return to home page"
        >
          <div className={styles.logoIcon} aria-hidden="true">🌸</div>
          <div className={styles.logoText}>
            <h1 className={styles.brandName}>BloomTrack</h1>
            <p className={styles.tagline}>Your beautiful journey</p>
          </div>
        </Link>

        {/* Pregnancy Info */}
        {pregnancyData.currentWeek > 0 && (
          <div 
            className={styles.pregnancyInfo}
            role="region"
            aria-label="Pregnancy progress information"
          >
            <div className={styles.weekInfo}>
              <span 
                className={styles.weekNumber}
                aria-label={`Current pregnancy week: ${pregnancyData.currentWeek}`}
              >
                {pregnancyData.currentWeek}
              </span>
              <span className={styles.weekLabel} aria-hidden="true">weeks</span>
            </div>
            <div className={styles.dueInfo}>
              <span className={styles.dueLabel} aria-hidden="true">Due</span>
              <span 
                className={styles.dueDate}
                aria-label={`Due date: ${formatDueDate(pregnancyData.dueDate)}`}
              >
                {formatDueDate(pregnancyData.dueDate)}
              </span>
            </div>
          </div>
        )}

        {/* User Actions */}
        <div className={styles.userActions}>
          {/* Notifications */}
          {showNotifications && (
            <button 
              className={styles.notificationBtn}
              onClick={() => setShowNotificationCenter(true)}
              aria-label={`View notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
              title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
            >
              <span role="img" aria-label="Bell">🔔</span>
              {unreadCount > 0 && (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              )}
            </button>
          )}

          {/* User Menu */}
          {showUserMenu && (
            <div className={styles.userMenu}>
              <button 
                className={styles.userBtn}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                data-open={showUserDropdown}
                aria-expanded={showUserDropdown}
                aria-haspopup="menu"
                aria-label={`User menu for ${user.name || 'Beautiful'}`}
              >
                <div className={styles.profileIcon} aria-hidden="true">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture.url || user.profilePicture} 
                      alt="Profile" 
                      className={styles.profileImage}
                    />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </div>
                <span>{user.name || 'Beautiful'}</span>
                <span className={styles.dropdownArrow} aria-hidden="true">▼</span>
              </button>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div 
                  className={styles.dropdown}
                  role="menu"
                  aria-label="User menu options"
                >
                  <Link 
                    to="/profile" 
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span role="img" aria-hidden="true">👤</span> Profile
                  </Link>
                  <Link 
                    to="/settings" 
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span role="img" aria-hidden="true">⚙️</span> Settings
                  </Link>
                  <Link 
                    to="/help" 
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span role="img" aria-hidden="true">❓</span> Help
                  </Link>
                  <button 
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => setShowUserDropdown(false)}
                  >
                    <span role="img" aria-hidden="true">🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notification Center Modal */}
      <NotificationCenter 
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
      />
    </header>
  );
};

export default Header;