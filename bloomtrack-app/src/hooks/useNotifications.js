import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [isSupported, setIsSupported] = useState(
    typeof window !== 'undefined' && 'Notification' in window
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    } else {
      setIsSupported(false);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, permission]);

  const showNotification = useCallback(
    (title, options = {}) => {
      if (!isSupported || permission !== 'granted') {
        console.warn('Notifications not available or not permitted');
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          ...options
        });

        return notification;
      } catch (error) {
        console.error('Error showing notification:', error);
        return null;
      }
    },
    [isSupported, permission]
  );

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    isGranted: permission === 'granted'
  };
}

export function usePregnancyReminders() {
  const { showNotification, isGranted, requestPermission } = useNotifications();

  const scheduleAppointmentReminder = useCallback(
    (appointment, minutesBefore = 60) => {
      if (!isGranted) {
        console.warn('Notifications not granted for appointment reminders');
        return;
      }

      const appointmentTime = new Date(appointment.date);
      const reminderTime = new Date(appointmentTime.getTime() - minutesBefore * 60 * 1000);
      const now = new Date();

      if (reminderTime <= now) {
        return; // Don't schedule past reminders
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        showNotification(`Upcoming Appointment`, {
          body: `${appointment.title} in ${minutesBefore} minutes at ${appointment.location || 'your healthcare provider'}`,
          tag: `appointment-${appointment.id}`,
          icon: '/icons/icon-192x192.png',
          data: { type: 'appointment', appointmentId: appointment.id }
        });
      }, timeUntilReminder);
    },
    [showNotification, isGranted]
  );

  const scheduleMedicationReminder = useCallback(
    (medication, time) => {
      if (!isGranted) return;

      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        showNotification(`Medication Reminder`, {
          body: `Time to take your ${medication.name}`,
          tag: `medication-${medication.id}`,
          icon: '/icons/icon-192x192.png',
          data: { type: 'medication', medicationId: medication.id }
        });
      }, timeUntilReminder);
    },
    [showNotification, isGranted]
  );

  const scheduleDailyCheckIn = useCallback(
    (time = '09:00') => {
      if (!isGranted) return;

      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        showNotification(`Daily Check-in`, {
          body: `How are you feeling today? Log your mood and symptoms`,
          tag: 'daily-checkin',
          icon: '/icons/icon-192x192.png',
          data: { type: 'daily-checkin' }
        });

        // Reschedule for tomorrow
        scheduleDailyCheckIn(time);
      }, timeUntilReminder);
    },
    [showNotification, isGranted]
  );

  const scheduleWeeklyMilestone = useCallback(
    (currentWeek, dayOfWeek = 1) => {
      if (!isGranted) return;

      const now = new Date();
      const nextMilestone = new Date();
      
      // Set to next Monday (or specified day)
      const daysUntilDay = (dayOfWeek + 7 - now.getDay()) % 7 || 7;
      nextMilestone.setDate(now.getDate() + daysUntilDay);
      nextMilestone.setHours(10, 0, 0, 0); // 10 AM

      const timeUntilReminder = nextMilestone.getTime() - now.getTime();

      setTimeout(() => {
        showNotification(`Weekly Milestone`, {
          body: `You're now ${currentWeek + 1} weeks pregnant! Check out this week's development updates`,
          tag: 'weekly-milestone',
          icon: '/icons/icon-192x192.png',
          data: { type: 'weekly-milestone', week: currentWeek + 1 }
        });
      }, timeUntilReminder);
    },
    [showNotification, isGranted]
  );

  return {
    scheduleAppointmentReminder,
    scheduleMedicationReminder,
    scheduleDailyCheckIn,
    scheduleWeeklyMilestone,
    requestPermission,
    isGranted
  };
}

export function useInAppNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove after 10 seconds for success/info notifications
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }

    return newNotification.id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id 
        ? { ...notification, read: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
}

export default useNotifications;