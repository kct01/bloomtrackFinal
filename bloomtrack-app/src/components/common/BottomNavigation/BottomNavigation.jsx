// File: src/components/common/BottomNavigation/BottomNavigation.jsx

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

const BottomNavigation = ({ 
  showBadges = true,
  hideOnDesktop = true 
}) => {
  const location = useLocation();

  // Navigation items configuration
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: '🏠',
      href: '/',
      badge: null,
      color: 'var(--color-soft-pink)'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: '📅',
      href: '/calendar',
      badge: 2, // Upcoming appointments
      color: 'var(--color-warm-peach)'
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: '🎯',
      href: '/milestones',
      badge: null,
      color: 'var(--color-gentle-lavender)'
    },
    {
      id: 'journal',
      label: 'Journal',
      icon: '📝',
      href: '/journal',
      badge: null,
      color: 'var(--color-sage-green)'
    },
    {
      id: 'photos',
      label: 'Photos',
      icon: '📸',
      href: '/photos',
      badge: null,
      color: 'var(--color-gentle-lavender)'
    },
  ];

  const handleQuickChat = () => {
    // Navigate to chat page
    window.location.href = '/chat';
  };

  return (
    <nav className={`${styles.bottomNavigation} ${hideOnDesktop ? styles.hideOnDesktop : ''}`} role="navigation" aria-label="Main navigation">
      <div className={styles.navContainer}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || (item.href === '/' && location.pathname === '/dashboard');
          
          return (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive: navIsActive }) => 
                `${styles.navItem} ${(isActive || navIsActive) ? styles.active : ''}`
              }
              aria-label={`Navigate to ${item.label}`}
              style={{ '--item-color': item.color }}
            >
              {/* Icon Container */}
              <div className={styles.iconContainer}>
                <span 
                  className={styles.navIcon}
                  role="img" 
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                
                {/* Badge */}
                {showBadges && item.badge && (
                  <span className={styles.badge} aria-label={`${item.badge} notifications`}>
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                
                {/* Active Indicator */}
                {(isActive || location.pathname === item.href) && (
                  <div className={styles.activeIndicator} aria-hidden="true"></div>
                )}
              </div>
              
              {/* Label */}
              <span className={styles.navLabel}>{item.label}</span>
              
              {/* Ripple Effect */}
              <div className={styles.ripple} aria-hidden="true"></div>
            </NavLink>
          );
        })}
      </div>
      
      {/* Community Chat Quick Access (Floating Action) */}
      <div className={styles.quickAccess}>
        <button 
          className={styles.quickAccessBtn}
          onClick={handleQuickChat}
          aria-label="Open community chat"
          title="Community Chat"
        >
          <span className={styles.quickAccessIcon}>💬</span>
          <span className={styles.quickAccessLabel}>Chat</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;