import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { usePregnancy } from '../../context/PregnancyContext';
import { useMilestones } from '../../context/MilestoneContext';
import { useCalendar } from '../../context/CalendarContext';
import Button from '../../components/common/Button';
import Onboarding from '../../components/common/Onboarding';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { pregnancyData, user, daysUntilDue, progressPercentage, isOnboarded, setOnboarded } = useApp();
  const { 
    currentWeekInfo,
    babyWeight,
    babyLength,
    currentTrimester,
    trimesterInfo,
    pregnancyProgress,
    isFullTerm,
    nextMilestone
  } = usePregnancy();
  const { getUpcomingMilestones } = useMilestones();
  const { getMoodForDate } = useCalendar();

  const upcomingMilestones = getUpcomingMilestones(3);
  const todaysMood = getMoodForDate(new Date().toISOString().split('T')[0]);

  // Quick action handlers
  const handleQuickAction = (action) => {
    switch(action) {
      case 'journal':
        // Navigate to journal page or open journal modal
        window.location.href = '/journal';
        break;
      case 'milestone':
        // Navigate to milestones page or open milestone form
        window.location.href = '/milestones';
        break;
      case 'mood':
        // Open mood tracking modal or navigate to calendar
        window.location.href = '/calendar';
        break;
      case 'appointment':
        // Navigate to calendar for appointment scheduling
        window.location.href = '/calendar';
        break;
      case 'symptoms':
        // Navigate to symptoms page
        window.location.href = '/symptoms';
        break;
      case 'weight':
        // Navigate to journal page for weight tracking
        window.location.href = '/journal';
        break;
      case 'photos':
        // Navigate to photos page
        window.location.href = '/photos';
        break;
      case 'checkup':
        // Navigate to calendar page for checkup scheduling
        window.location.href = '/calendar';
        break;
      case 'chat':
        // Navigate to chat page
        window.location.href = '/chat';
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleOnboardingComplete = () => {
    setOnboarded(true);
  };

  const handleEditBabyDetails = () => {
    // Navigate to Profile page and set the pregnancy tab as active
    navigate('/profile', { state: { activeTab: 'pregnancy' } });
  };

  // Show onboarding if user is not onboarded
  if (!isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const formatDaysUntilDue = (days) => {
    if (days <= 0) return "Baby's here! 👶";
    if (days === 1) return "1 day to go! 🎉";
    if (days <= 7) return `${days} days to go! 🌟`;
    if (days <= 30) return `${days} days to go`;
    
    const weeks = Math.floor(days / 7);
    return `${weeks} weeks to go`;
  };

  return (
    <div className={styles.dashboard}>
      
      {/* Welcome Header */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>
            Welcome back, {user.name || 'Beautiful'} 🌸
          </h1>
          <p className={styles.welcomeSubtitle}>
            How are you feeling today? Let's check on your pregnancy journey.
          </p>
        </div>
        
        {pregnancyData.currentWeek > 0 && (
          <div className={styles.pregnancyOverview}>
            <div className={styles.overviewGrid}>
              <div className={styles.weekDisplay}>
                <span className={styles.weekNumber}>Week {pregnancyData.currentWeek}</span>
                <span className={styles.trimesterBadge}>
                  {trimesterInfo?.name || `Trimester ${pregnancyData.trimester}`}
                </span>
                {isFullTerm && <span className={styles.fullTermBadge}>✨ Full Term</span>}
              </div>
              
              <div className={styles.babyStats}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>👶</span>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Baby Size</span>
                    <span className={styles.statValue}>{currentWeekInfo?.babySize || 'Growing'}</span>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>📏</span>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Length</span>
                    <span className={styles.statValue}>{babyLength}</span>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>⚖️</span>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Weight</span>
                    <span className={styles.statValue}>{babyWeight}</span>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>📅</span>
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Due Date</span>
                    <button 
                      className={styles.statValueButton}
                      onClick={() => navigate('/calendar')}
                      title="View calendar and appointments"
                    >
                      {pregnancyData.dueDate ? new Date(pregnancyData.dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      }) : 'Not set'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className={styles.dueDate}>
                <button 
                  className={styles.dueDateButton}
                  onClick={() => navigate('/calendar')}
                  title="View calendar and appointments"
                >
                  {daysUntilDue <= 0 ? "Baby's here! 👶" : 
                   daysUntilDue <= 7 ? `${daysUntilDue} days to go! 🌟` :
                   `${Math.ceil(daysUntilDue / 7)} weeks to go`}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pregnancy Milestones Timeline - Featured Section */}
      {pregnancyData.currentWeek > 0 && (
        <div className={`${styles.card} ${styles.timelineCard} ${styles.featuredTimeline}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>🎯 Pregnancy Milestones Timeline</h2>
            <p className={styles.cardSubtitle}>Your journey from conception to birth</p>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.milestonesTimeline}>
              <div className={styles.timelineContainer}>
                <div className={styles.timelineTrack}>
                  {/* Milestone markers */}
                  {[8, 12, 20, 24, 28, 36, 40].map((week, index) => {
                    const getBabyFact = (week) => {
                      const facts = {
                        8: {
                          title: "Tiny Miracle (Week 8)",
                          fact: "Your baby is now the size of a raspberry! All major organs have formed and tiny fingers and toes are developing.",
                          size: "🫐"
                        },
                        12: {
                          title: "Growing Strong (Week 12)", 
                          fact: "Baby can now move their fingers and toes! Their reflexes are developing and they might even hiccup.",
                          size: "🫒"
                        },
                        20: {
                          title: "Halfway Hero (Week 20)",
                          fact: "You can feel those first kicks! Baby's hearing is developing and they can recognize your voice.",
                          size: "🍌"
                        },
                        24: {
                          title: "Survival Milestone (Week 24)",
                          fact: "Baby's lungs are developing rapidly! They're practicing breathing movements and their brain is growing quickly.",
                          size: "🌽"
                        },
                        28: {
                          title: "Final Stretch (Week 28)",
                          fact: "Baby's eyes can now open and close! They're developing sleep cycles and gaining fat to stay warm.",
                          size: "🥑"
                        },
                        36: {
                          title: "Almost Ready (Week 36)",
                          fact: "Baby's bones are hardening and their immune system is strengthening! They're getting ready for the outside world.",
                          size: "🥥"
                        },
                        40: {
                          title: "Ready to Meet You! (Week 40)",
                          fact: "Your little one is fully developed and ready for their grand entrance! What an incredible journey you've both taken.",
                          size: "🍉"
                        }
                      };
                      return facts[week];
                    };

                    const babyFact = getBabyFact(week);

                    return (
                      <div
                        key={week}
                        className={`${styles.timelineMarker} ${
                          pregnancyData.currentWeek >= week ? styles.completed : styles.upcoming
                        }`}
                        style={{ left: `${(week / 40) * 100}%` }}
                      >
                        <div className={styles.markerDot}>
                          {pregnancyData.currentWeek >= week ? '✓' : week}
                        </div>
                        
                        {/* Hover tooltip with baby fact */}
                        <div className={styles.babyFactTooltip}>
                          <div className={styles.tooltipHeader}>
                            <span className={styles.babySize}>{babyFact?.size}</span>
                            <span className={styles.factTitle}>{babyFact?.title}</span>
                          </div>
                          <p className={styles.factText}>{babyFact?.fact}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Current position indicator */}
                  <div
                    className={styles.currentPositionMarker}
                    style={{ left: `${(pregnancyData.currentWeek / 40) * 100}%` }}
                  >
                    <div className={styles.currentMarker}>👶</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        
        {/* Quick Actions Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>⚡ Quick Actions</h2>
            <p className={styles.cardSubtitle}>Track your pregnancy journey</p>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.quickActionsGrid}>
              {/* Primary Actions */}
              <div className={styles.primaryActions}>
                <Button 
                  variant="gentle" 
                  size="medium" 
                  className={styles.primaryAction}
                  onClick={() => handleQuickAction('journal')}
                >
                  <div className={styles.actionContent}>
                    <span className={styles.actionTitle}>Journal Entry</span>
                  </div>
                </Button>
                
                <Button 
                  variant="gentle" 
                  size="medium" 
                  className={styles.primaryAction}
                  onClick={() => handleQuickAction('mood')}
                >
                  <div className={styles.actionContent}>
                    <span className={styles.actionTitle}>Track Mood</span>
                  </div>
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className={styles.secondaryActions}>
                <Button 
                  variant="gentle" 
                  size="small" 
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('milestone')}
                >
                  <span className={styles.actionIcon}>🎯</span>
                  <span>Log Milestone</span>
                </Button>
                
                <Button 
                  variant="gentle" 
                  size="small" 
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('appointment')}
                >
                  <span className={styles.actionIcon}>📅</span>
                  <span>Schedule Visit</span>
                </Button>
                
                <Button 
                  variant="gentle" 
                  size="small" 
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('symptoms')}
                >
                  <span className={styles.actionIcon}>🩺</span>
                  <span>Log Symptoms</span>
                </Button>
                
                <Button 
                  variant="gentle" 
                  size="small" 
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('weight')}
                >
                  <span className={styles.actionIcon}>⚖️</span>
                  <span>Track Weight</span>
                </Button>
                
                <Button 
                  variant="gentle" 
                  size="small" 
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('photos')}
                >
                  <span className={styles.actionIcon}>📸</span>
                  <span>Add Photo</span>
                </Button>
                
                <Button 
                  variant="gentle" 
                  size="small" 
                  className={styles.quickAction}
                  onClick={() => handleQuickAction('checkup')}
                >
                  <span className={styles.actionIcon}>🏥</span>
                  <span>Next Checkup</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Baby Details Card - Read Only */}
        {pregnancyData.currentWeek > 0 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>👶 Baby Details</h2>
              <p className={styles.cardSubtitle}>Your little one's information</p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.babyDetailsDisplay}>
                
                {/* Baby Name Display */}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>👶 Name:</span>
                  <span className={styles.detailValue}>
                    {pregnancyData.babyDetails?.name || 'Little One'}
                  </span>
                </div>

                {/* Gender Display */}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>💝 Gender:</span>
                  <span className={styles.detailValue}>
                    {pregnancyData.babyDetails?.gender === 'boy' && '💙 Boy'}
                    {pregnancyData.babyDetails?.gender === 'girl' && '💗 Girl'}
                    {pregnancyData.babyDetails?.gender === 'surprise' && '💛 Surprise'}
                    {!pregnancyData.babyDetails?.gender && '💛 Surprise'}
                  </span>
                </div>

                {/* Baby Stats Display */}
                <div className={styles.detailRow}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>⚖️ Weight:</span>
                    <span className={styles.detailValue}>
                      {pregnancyData.babyDetails?.weight || babyWeight || 'Calculating...'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>📏 Length:</span>
                    <span className={styles.detailValue}>
                      {pregnancyData.babyDetails?.length || babyLength || 'Calculating...'}
                    </span>
                  </div>
                </div>

                {/* Due Date Display */}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>📅 Due Date:</span>
                  <span className={styles.detailValue}>
                    {pregnancyData.dueDate ? new Date(pregnancyData.dueDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Not set'}
                  </span>
                </div>

                {/* Edit Button */}
                <div className={styles.editActions}>
                  <Button 
                    variant="gentle" 
                    size="medium" 
                    className={styles.editButton}
                    onClick={handleEditBabyDetails}
                  >
                    ✏️ Edit Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Mood & Health Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>💕 Today's Wellness Check</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.wellnessContent}>
              {todaysMood ? (
                <div className={styles.todaysMoodDisplay}>
                  <div className={styles.moodInfo}>
                    <span className={styles.moodEmoji}>
                      {(() => {
                        const moodEmojis = {
                          excellent: '😊',
                          good: '🙂',
                          okay: '😐',
                          low: '😔',
                          difficult: '😰'
                        };
                        return moodEmojis[todaysMood.mood] || '😊';
                      })()}
                    </span>
                    <div className={styles.moodDetails}>
                      <span className={styles.moodLabel}>
                        Feeling {todaysMood.mood}
                      </span>
                      <span className={styles.energyLabel}>
                        {todaysMood.energy} energy
                      </span>
                    </div>
                  </div>
                  {todaysMood.symptoms && todaysMood.symptoms.length > 0 && (
                    <div className={styles.todaysSymptoms}>
                      <small>Today's symptoms: {todaysMood.symptoms.join(', ')}</small>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.noMoodToday}>
                  <p>Haven't tracked your mood today yet</p>
                  <Button 
                    variant="gentle" 
                    size="small"
                    onClick={() => navigate('/calendar')}
                  >
                    Track Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Progress & Milestones Row - Side by Side */}
        <div className={styles.milestonesRow}>
          {/* Upcoming Milestones Card */}
          <div className={`${styles.card} ${styles.compactCard}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>🎯 Upcoming Milestones</h2>
            </div>
            <div className={styles.cardContent}>
              {upcomingMilestones.length > 0 ? (
                <div className={styles.milestonesList}>
                  {upcomingMilestones.slice(0, 3).map((milestone, index) => (
                    <div 
                      key={`upcoming-${milestone.id}-${index}`} 
                      className={styles.milestoneItem}
                      onClick={() => navigate('/milestones')}
                      style={{ cursor: 'pointer' }}
                    >
                      <span className={styles.milestoneIcon}>{milestone.icon}</span>
                      <div className={styles.milestoneInfo}>
                        <p className={styles.milestoneName}>{milestone.title}</p>
                        <p className={styles.milestoneWeek}>Week {milestone.week}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No upcoming milestones. Great job staying on track! 🌟</p>
              )}
            </div>
          </div>

          {/* Your Journey Progress Card */}
          <div className={`${styles.card} ${styles.compactCard}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>📈 Your Journey Progress</h2>
              <p className={styles.cardSubtitle}>Complete overview of your pregnancy</p>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.progressSummary}>
                {/* Overall Progress */}
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Overall Pregnancy</span>
                    <span className={styles.progressValue}>{Math.round(pregnancyProgress)}%</span>
                  </div>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarTrack}>
                      <div 
                        className={`${styles.progressBarFill} ${styles.overallProgress}`}
                        style={{ width: `${pregnancyProgress}%` }}
                      ></div>
                    </div>
                    <span className={styles.progressNote}>
                      Week {pregnancyData.currentWeek} of 40
                    </span>
                  </div>
                </div>

                {/* Trimester Progress */}
                <div className={styles.progressItem}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>{trimesterInfo?.name}</span>
                    <span className={styles.progressValue}>
                      {Math.round(trimesterInfo ? ((pregnancyData.currentWeek - (currentTrimester === 1 ? 0 : currentTrimester === 2 ? 12 : 27)) / (currentTrimester === 1 ? 12 : 15)) * 100 : 0)}%
                    </span>
                  </div>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBarTrack}>
                      <div 
                        className={`${styles.progressBarFill} ${styles[`trimester${currentTrimester}Progress`]}`}
                        style={{ 
                          width: `${trimesterInfo ? ((pregnancyData.currentWeek - (currentTrimester === 1 ? 0 : currentTrimester === 2 ? 12 : 27)) / (currentTrimester === 1 ? 12 : 15)) * 100 : 0}%` 
                        }}
                      ></div>
                    </div>
                    <span className={styles.progressNote}>
                      {trimesterInfo?.description || 'Current phase'}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Weekly Tips Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>💡 This Week's Tips</h2>
            <span className={styles.weekBadge}>Week {pregnancyData.currentWeek}</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tipsContent}>
              {currentWeekInfo?.tips ? (
                <div className={styles.tipsList}>
                  {currentWeekInfo.tips.slice(0, 3).map((tip, index) => (
                    <div key={index} className={styles.tipItem}>
                      <span className={styles.tipIcon}>✨</span>
                      <span className={styles.tipText}>{tip}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.defaultTips}>
                  <div className={styles.tipItem}>
                    <span className={styles.tipIcon}>🥗</span>
                    <span className={styles.tipText}>Eat a balanced diet with plenty of fruits and vegetables</span>
                  </div>
                  <div className={styles.tipItem}>
                    <span className={styles.tipIcon}>💧</span>
                    <span className={styles.tipText}>Stay hydrated - aim for 8-10 glasses of water daily</span>
                  </div>
                  <div className={styles.tipItem}>
                    <span className={styles.tipIcon}>😴</span>
                    <span className={styles.tipText}>Get plenty of rest and listen to your body</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>🤗 Support & Community</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.supportContent}>
              <p>Connect with other expecting mothers and your care team.</p>
              <div className={styles.supportActions}>
                <Button 
                  variant="secondary" 
                  size="medium"
                  onClick={() => handleQuickAction('chat')}
                >
                  Join Community Chat
                </Button>
                <Button variant="secondary" size="medium">
                  Emergency Contacts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Get Started Section - For New Users */}
      {pregnancyData.currentWeek === 0 && (
        <div className={styles.getStartedSection}>
          <div className={styles.getStartedCard}>
            <h2>🌸 Welcome to BloomTrack!</h2>
            <p>Let's set up your pregnancy journey to get personalized tracking and support.</p>
            <div className={styles.getStartedActions}>
              <Button variant="primary" size="large">
                Set Up Pregnancy Info
              </Button>
              <Button variant="secondary" size="large">
                Take a Tour
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;