import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Target, 
  BookOpen, 
  MessageCircle, 
  User, 
  Heart,
  Baby,
  TrendingUp,
  Bell,
  Settings
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useCalendar } from '../../../context/CalendarContext';
import { useMilestones } from '../../../context/MilestoneContext';
import { useJournal } from '../../../context/JournalContext';
import { useChat } from '../../../context/ChatContext';
import styles from './Navigation.module.css';

function Navigation({ isMobile = false, isBottomNav = false, currentPath, onNavigate }) {
  const location = useLocation();
  const currentRoute = currentPath || location.pathname;
  
  const { pregnancyData, progressPercentage } = useApp();
  const { moodStats } = useCalendar();
  const { progress: milestoneProgress } = useMilestones();
  const { hasWrittenToday } = useJournal();
  const { getTotalUnreadCount } = useChat();

  const unreadMessages = getTotalUnreadCount();
  const currentStreak = moodStats?.currentStreak || 0;

  // Navigation items with dynamic badges and info
  const navigationItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: Home,
      description: 'Your pregnancy overview',
      badge: null,
      isActive: currentRoute === '/'
    },
    {
      path: '/calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'Appointments & mood tracking',
      badge: currentStreak > 0 ? `${currentStreak} day streak` : null,
      isActive: currentRoute === '/calendar'
    },
    {
      path: '/milestones',
      label: 'Milestones',
      icon: Target,
      description: 'Celebrate your journey',
      badge: milestoneProgress.upcomingCount > 0 ? `${milestoneProgress.upcomingCount} upcoming` : null,
      isActive: currentRoute === '/milestones'
    },
    {
      path: '/journal',
      label: 'Journal',
      icon: BookOpen,
      description: 'Daily reflections & thoughts',
      badge: !hasWrittenToday() ? 'Write today' : '✓ Written',
      badgeType: !hasWrittenToday() ? 'reminder' : 'success',
      isActive: currentRoute === '/journal'
    },
    {
      path: '/chat',
      label: 'Community',
      icon: MessageCircle,
      description: 'Connect & get support',
      badge: unreadMessages > 0 ? `${unreadMessages} new` : null,
      badgeType: 'notification',
      isActive: currentRoute === '/chat'
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User,
      description: 'Your account & settings',
      badge: null,
      isActive: currentRoute === '/profile'
    }
  ];

  const handleNavClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  if (isBottomNav) {
    // Mobile bottom navigation - simplified
    const bottomNavItems = navigationItems.slice(0, 5); // Only show main 5
    
    return (
      <nav className={styles.bottomNavigation}>
        <div className={styles.bottomNavContainer}>
          {bottomNavItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles.bottomNavItem} ${item.isActive ? styles.active : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <div className={styles.bottomNavIcon}>
                  <IconComponent size={20} />
                  {item.badge && item.badgeType === 'notification' && (
                    <span className={styles.bottomNavBadge}>{unreadMessages}</span>
                  )}
                </div>
                <span className={styles.bottomNavLabel}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${styles.navigation} ${isMobile ? styles.mobileNav : styles.desktopNav}`}>
      
      {/* Pregnancy Progress Summary - Desktop Sidebar Only */}
      {!isMobile && pregnancyData.currentWeek > 0 && (
        <div className={styles.pregnancyWidget}>
          <div className={styles.pregnancyHeader}>
            <Baby className={styles.pregnancyIcon} />
            <div>
              <h3 className={styles.pregnancyTitle}>Week {pregnancyData.currentWeek}</h3>
              <p className={styles.pregnancySubtitle}>Trimester {pregnancyData.trimester}</p>
            </div>
          </div>
          
          <div className={styles.pregnancyProgress}>
            <div className={styles.progressTrack}>
              <div 
                className={styles.progressFill}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{Math.round(progressPercentage)}% Complete</span>
          </div>
          
          <div className={styles.pregnancyStats}>
            <div className={styles.statItem}>
              <Heart size={14} />
              <span>{milestoneProgress.achievedCount} milestones achieved</span>
            </div>
            <div className={styles.statItem}>
              <TrendingUp size={14} />
              <span>{currentStreak} day mood streak</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Items */}
      <div className={styles.navItems}>
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <div className={styles.navItemContent}>
                <div className={styles.navIcon}>
                  <IconComponent size={isMobile ? 20 : 22} />
                </div>
                
                <div className={styles.navInfo}>
                  <span className={styles.navLabel}>{item.label}</span>
                  {!isMobile && (
                    <span className={styles.navDescription}>{item.description}</span>
                  )}
                </div>

                {/* Badges and Notifications */}
                {item.badge && (
                  <span className={`${styles.navBadge} ${styles[item.badgeType || 'default']}`}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Active indicator */}
              {item.isActive && <div className={styles.activeIndicator}></div>}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions - Desktop Only */}
      {!isMobile && (
        <div className={styles.quickActions}>
          <div className={styles.quickActionsHeader}>
            <h4>Quick Actions</h4>
          </div>
          
          <div className={styles.quickActionsList}>
            <button className={styles.quickAction}>
              <BookOpen size={16} />
              <span>Add Journal Entry</span>
            </button>
            
            <button className={styles.quickAction}>
              <Target size={16} />
              <span>Log Milestone</span>
            </button>
            
            <button className={styles.quickAction}>
              <Heart size={16} />
              <span>Track Mood</span>
            </button>
            
            <button className={styles.quickAction}>
              <Calendar size={16} />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </div>
      )}

      {/* Support Section - Desktop Only */}
      {!isMobile && (
        <div className={styles.supportSection}>
          <div className={styles.supportCard}>
            <div className={styles.supportIcon}>💕</div>
            <h4 className={styles.supportTitle}>Need Support?</h4>
            <p className={styles.supportText}>
              Connect with our community or reach out to your care team anytime.
            </p>
            <Link to="/chat" className={styles.supportButton}>
              Get Help
            </Link>
          </div>
        </div>
      )}

      {/* Settings Link - Always at Bottom */}
      <div className={styles.navFooter}>
        <Link
          to="/settings"
          className={`${styles.navItem} ${styles.settingsItem} ${currentRoute === '/settings' ? styles.active : ''}`}
          onClick={() => handleNavClick('/settings')}
        >
          <div className={styles.navItemContent}>
            <div className={styles.navIcon}>
              <Settings size={isMobile ? 18 : 20} />
            </div>
            <div className={styles.navInfo}>
              <span className={styles.navLabel}>Settings</span>
              {!isMobile && (
                <span className={styles.navDescription}>Preferences & privacy</span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;