import React, { useState, useEffect } from 'react';
import { useNotifications, usePregnancyReminders } from '../../../hooks/useNotifications';
import { useInAppNotifications } from '../../../context/NotificationContext';
import { useApp } from '../../../context/AppContext';
import Button from '../Button';
import styles from './NotificationSettings.module.css';

function NotificationSettings() {
  const { permission, isSupported, requestPermission, isGranted } = useNotifications();
  const { 
    scheduleAppointmentReminder, 
    scheduleMedicationReminder, 
    scheduleDailyCheckIn, 
    scheduleWeeklyMilestone 
  } = usePregnancyReminders();
  const { addNotification } = useInAppNotifications();
  const { user, pregnancyData } = useApp();

  // Notification preferences state
  const [preferences, setPreferences] = useState({
    appointments: true,
    milestones: true,
    dailyCheckin: true,
    medications: false,
    weeklyUpdates: true,
    // Time preferences
    dailyCheckinTime: '09:00',
    appointmentReminderMinutes: 60,
    milestoneDay: 1 // Monday
  });

  // Load preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('bloomtrack_notification_preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('bloomtrack_notification_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      addNotification({
        type: 'success',
        title: 'Notifications Enabled! 🎉',
        message: 'You\'ll now receive pregnancy reminders and updates.'
      });
      
      // Schedule initial notifications
      setupNotifications();
    } else {
      addNotification({
        type: 'error',
        title: 'Notifications Blocked',
        message: 'Please enable notifications in your browser settings for the best experience.'
      });
    }
  };

  const setupNotifications = () => {
    if (!isGranted) return;

    // Schedule daily check-in
    if (preferences.dailyCheckin) {
      scheduleDailyCheckIn(preferences.dailyCheckinTime);
    }

    // Schedule weekly milestones
    if (preferences.milestones && pregnancyData.currentWeek) {
      scheduleWeeklyMilestone(pregnancyData.currentWeek, preferences.milestoneDay);
    }
  };

  const testNotification = () => {
    console.log('🔔 Test notification clicked');
    console.log('isGranted:', isGranted);
    console.log('addNotification function:', typeof addNotification);
    
    if (isGranted) {
      console.log('Adding success notification...');
      addNotification({
        type: 'info',
        title: 'Test Notification 📢',
        message: 'Your notifications are working perfectly!'
      });
    } else {
      console.log('Adding warning notification...');
      addNotification({
        type: 'warning',
        title: 'Enable Notifications First',
        message: 'Please grant notification permission to test notifications.'
      });
    }
  };

  const addDemoNotifications = () => {
    console.log('🎭 Demo notifications clicked');
    console.log('addNotification function:', typeof addNotification);
    
    // Add several demo notifications to showcase the system
    console.log('Adding milestone notification...');
    addNotification({
      type: 'milestone',
      title: '🎉 Week 22 Milestone!',
      message: 'Congratulations! Your baby is now the size of a coconut and can hear sounds from outside the womb.',
      data: { type: 'weekly-milestone', week: 22 }
    });

    setTimeout(() => {
      addNotification({
        type: 'appointment',
        title: '📅 Upcoming Appointment',
        message: 'Don\'t forget your prenatal checkup tomorrow at 2:00 PM with Dr. Smith.',
        data: { type: 'appointment', appointmentId: 'demo-1' }
      });
    }, 1000);

    setTimeout(() => {
      addNotification({
        type: 'success',
        title: '✅ Daily Check-in Complete',
        message: 'Great job logging your mood and symptoms today! Keep up the healthy habits.'
      });
    }, 2000);

    setTimeout(() => {
      addNotification({
        type: 'info',
        title: '💡 Tip of the Day',
        message: 'Remember to stay hydrated! Aim for 8-10 glasses of water daily during pregnancy.'
      });
    }, 3000);
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { text: 'Enabled ✅', color: 'success' };
      case 'denied':
        return { text: 'Blocked ❌', color: 'error' };
      default:
        return { text: 'Not Set ⚠️', color: 'warning' };
    }
  };

  const permissionStatus = getPermissionStatus();

  return (
    <div className={styles.notificationSettings}>
      <div className={styles.header}>
        <h3>🔔 Notification Settings</h3>
        <p className={styles.description}>
          Stay connected to your pregnancy journey with gentle reminders and celebrations.
        </p>
      </div>

      {/* Browser Support Check */}
      {!isSupported && (
        <div className={styles.alert} data-type="error">
          <span className={styles.alertIcon}>⚠️</span>
          <div>
            <strong>Notifications Not Supported</strong>
            <p>Your browser doesn't support notifications. Please try a modern browser like Chrome, Firefox, or Safari.</p>
          </div>
        </div>
      )}

      {/* Permission Status */}
      <div className={styles.permissionSection}>
        <div className={styles.permissionStatus}>
          <span className={styles.statusLabel}>Browser Permissions:</span>
          <span className={`${styles.statusText} ${styles[permissionStatus.color]}`}>
            {permissionStatus.text}
          </span>
        </div>

        {!isGranted && isSupported && (
          <div className={styles.permissionActions}>
            <Button 
              variant="gentle" 
              size="small" 
              onClick={handleEnableNotifications}
              className={styles.enableButton}
            >
              🔔 Enable Notifications
            </Button>
            <p className={styles.permissionNote}>
              We'll send gentle reminders about appointments, milestones, and daily check-ins.
            </p>
          </div>
        )}

        {isGranted && (
          <div className={styles.testSection}>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={testNotification}
              className={styles.testButton}
            >
              📢 Test Notification
            </Button>
            <Button 
              variant="gentle" 
              size="small" 
              onClick={addDemoNotifications}
              className={styles.demoButton}
            >
              🎭 Demo Notifications
            </Button>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      {isGranted && (
        <div className={styles.preferencesSection}>
          <h4>Notification Preferences</h4>
          
          <div className={styles.preferencesList}>
            {/* Appointment Reminders */}
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceHeader}>
                <label className={styles.preferenceLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.appointments}
                    onChange={(e) => handlePreferenceChange('appointments', e.target.checked)}
                    className={styles.checkbox}
                  />
                  📅 Appointment Reminders
                </label>
              </div>
              <p className={styles.preferenceDescription}>
                Get notified before your prenatal appointments
              </p>
              {preferences.appointments && (
                <div className={styles.subPreference}>
                  <label className={styles.subLabel}>
                    Remind me:
                    <select
                      value={preferences.appointmentReminderMinutes}
                      onChange={(e) => handlePreferenceChange('appointmentReminderMinutes', parseInt(e.target.value))}
                      className={styles.select}
                    >
                      <option value={15}>15 minutes before</option>
                      <option value={30}>30 minutes before</option>
                      <option value={60}>1 hour before</option>
                      <option value={120}>2 hours before</option>
                      <option value={1440}>1 day before</option>
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Weekly Milestones */}
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceHeader}>
                <label className={styles.preferenceLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.milestones}
                    onChange={(e) => handlePreferenceChange('milestones', e.target.checked)}
                    className={styles.checkbox}
                  />
                  🎉 Weekly Milestones
                </label>
              </div>
              <p className={styles.preferenceDescription}>
                Celebrate each week of your pregnancy journey
              </p>
              {preferences.milestones && (
                <div className={styles.subPreference}>
                  <label className={styles.subLabel}>
                    Notify me on:
                    <select
                      value={preferences.milestoneDay}
                      onChange={(e) => handlePreferenceChange('milestoneDay', parseInt(e.target.value))}
                      className={styles.select}
                    >
                      <option value={1}>Monday</option>
                      <option value={2}>Tuesday</option>
                      <option value={3}>Wednesday</option>
                      <option value={4}>Thursday</option>
                      <option value={5}>Friday</option>
                      <option value={6}>Saturday</option>
                      <option value={0}>Sunday</option>
                    </select>
                  </label>
                </div>
              )}
            </div>

            {/* Daily Check-in */}
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceHeader}>
                <label className={styles.preferenceLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.dailyCheckin}
                    onChange={(e) => handlePreferenceChange('dailyCheckin', e.target.checked)}
                    className={styles.checkbox}
                  />
                  💭 Daily Check-in
                </label>
              </div>
              <p className={styles.preferenceDescription}>
                Daily prompts to log your mood and symptoms
              </p>
              {preferences.dailyCheckin && (
                <div className={styles.subPreference}>
                  <label className={styles.subLabel}>
                    Time:
                    <input
                      type="time"
                      value={preferences.dailyCheckinTime}
                      onChange={(e) => handlePreferenceChange('dailyCheckinTime', e.target.value)}
                      className={styles.timeInput}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Weekly Updates */}
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceHeader}>
                <label className={styles.preferenceLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.weeklyUpdates}
                    onChange={(e) => handlePreferenceChange('weeklyUpdates', e.target.checked)}
                    className={styles.checkbox}
                  />
                  📰 Weekly Development Updates
                </label>
              </div>
              <p className={styles.preferenceDescription}>
                Learn about your baby's development each week
              </p>
            </div>

            {/* Medication Reminders */}
            <div className={styles.preferenceItem}>
              <div className={styles.preferenceHeader}>
                <label className={styles.preferenceLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.medications}
                    onChange={(e) => handlePreferenceChange('medications', e.target.checked)}
                    className={styles.checkbox}
                  />
                  💊 Medication Reminders
                </label>
              </div>
              <p className={styles.preferenceDescription}>
                Reminders for prenatal vitamins and medications
              </p>
            </div>
          </div>

          <div className={styles.setupActions}>
            <Button 
              variant="gentle" 
              size="small" 
              onClick={setupNotifications}
              className={styles.setupButton}
            >
              💾 Save & Apply Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationSettings;