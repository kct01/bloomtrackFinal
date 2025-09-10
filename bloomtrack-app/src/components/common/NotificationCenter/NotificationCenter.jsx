import React, { useState } from 'react';
import { useInAppNotifications } from '../../../context/NotificationContext';
import Button from '../Button';
import styles from './NotificationCenter.module.css';

function NotificationCenter({ isOpen, onClose }) {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useInAppNotifications();

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle different notification types
    switch (notification.data?.type) {
      case 'appointment':
        // Navigate to calendar
        break;
      case 'milestone':
        // Navigate to milestones
        break;
      case 'daily-checkin':
        // Navigate to journal
        break;
      default:
        break;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'milestone': return '🎉';
      case 'appointment': return '📅';
      case 'medication': return '💊';
      case 'daily-checkin': return '💭';
      default: return '🔔';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.notificationCenter} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            🔔 Notifications
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount}</span>
            )}
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className={styles.actions}>
            {unreadCount > 0 && (
              <Button 
                variant="secondary" 
                size="small" 
                onClick={markAllAsRead}
                className={styles.actionButton}
              >
                Mark All Read
              </Button>
            )}
            <Button 
              variant="secondary" 
              size="small" 
              onClick={clearAll}
              className={styles.actionButton}
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className={styles.notificationsList}>
          {notifications.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🌸</div>
              <h4>All caught up!</h4>
              <p>You have no notifications right now. Enjoy your peaceful moment! 💕</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${
                  !notification.read ? styles.unread : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className={styles.notificationContent}>
                  <div className={styles.notificationHeader}>
                    <h4 className={styles.notificationTitle}>
                      {notification.title}
                    </h4>
                    <span className={styles.notificationTime}>
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  
                  {notification.message && (
                    <p className={styles.notificationMessage}>
                      {notification.message}
                    </p>
                  )}
                </div>

                <div className={styles.notificationActions}>
                  {!notification.read && (
                    <button
                      className={styles.markReadButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  
                  <button
                    className={styles.removeButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    title="Remove notification"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className={styles.footer}>
            <p className={styles.footerText}>
              {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              {unreadCount > 0 && ` • ${unreadCount} unread`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationCenter;