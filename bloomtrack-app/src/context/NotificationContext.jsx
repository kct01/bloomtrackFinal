import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const NotificationContext = createContext();

// Provider component
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    console.log('📝 Adding notification to context:', notification);
    const newNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log('📋 Updated notifications:', updated);
      return updated;
    });
    
    setUnreadCount(prev => {
      const newCount = prev + 1;
      console.log('🔢 Updated unread count:', newCount);
      return newCount;
    });

    // Auto-remove after 10 seconds for success/info notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }

    return newNotification.id;
  }, []);

  const removeNotification = useCallback((id) => {
    console.log('🗑️ Removing notification:', id);
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const markAsRead = useCallback((id) => {
    console.log('✅ Marking as read:', id);
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    console.log('✅ Marking all as read');
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    console.log('🧹 Clearing all notifications');
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const contextValue = {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use the notification context
export function useInAppNotifications() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useInAppNotifications must be used within a NotificationProvider');
  }
  
  return context;
}

export default NotificationProvider;