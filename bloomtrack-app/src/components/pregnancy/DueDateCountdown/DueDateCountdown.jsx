import { useState, useEffect, useMemo } from 'react';
import styles from './DueDateCountdown.module.css';
import { Calendar, Heart, Sparkles, Baby, Clock } from 'lucide-react';
import { 
  calculateDaysRemaining, 
  isOverdue, 
  isFullTerm,
  formatPregnancyWeek 
} from '../../../utils/pregnancyCalculations';

/**
 * DueDateCountdown Component
 * Displays countdown to due date with celebration effects and animations
 */
function DueDateCountdown({ 
  dueDate,
  currentWeek = 1,
  variant = 'default', // 'default', 'detailed', 'compact', 'celebration'
  showCelebration = true,
  showProgress = true,
  showWeeks = true,
  animated = true,
  className = ''
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConfetti, setShowConfetti] = useState(false);

  // Update current time every minute for accurate countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate countdown values
  const countdownData = useMemo(() => {
    if (!dueDate) return null;

    const daysRemaining = calculateDaysRemaining(dueDate, currentTime);
    const isOverdueFlag = isOverdue(dueDate, currentTime);
    const isFullTermFlag = isFullTerm(currentWeek);
    
    // Calculate time units
    const absDays = Math.abs(daysRemaining);
    const weeks = Math.floor(absDays / 7);
    const days = absDays % 7;
    const months = Math.floor(absDays / 30);
    const remainingDaysAfterMonths = absDays % 30;

    return {
      daysRemaining,
      isOverdue: isOverdueFlag,
      isFullTerm: isFullTermFlag,
      weeks,
      days,
      months,
      remainingDaysAfterMonths,
      isCloseToTerm: currentWeek >= 36,
      isTermTime: currentWeek >= 37,
      totalDays: absDays
    };
  }, [dueDate, currentTime, currentWeek]);

  // Trigger celebration effect for milestones
  useEffect(() => {
    if (showCelebration && countdownData) {
      const { isTermTime, daysRemaining, isCloseToTerm } = countdownData;
      
      // Show celebration when reaching full term or very close to due date
      if ((isTermTime && currentWeek === 37) || 
          (daysRemaining <= 7 && daysRemaining > 0) ||
          (isCloseToTerm && currentWeek === 36)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [countdownData, showCelebration, currentWeek]);

  if (!dueDate || !countdownData) {
    return (
      <div className={`${styles.countdown} ${styles.placeholder} ${className}`}>
        <div className={styles.placeholderContent}>
          <Calendar className={styles.placeholderIcon} />
          <span>Set your due date to see countdown</span>
        </div>
      </div>
    );
  }

  const { 
    daysRemaining, 
    isOverdue: isOverdueFlag, 
    isFullTerm: isFullTermFlag,
    weeks, 
    days, 
    months,
    isTermTime,
    isCloseToTerm,
    totalDays
  } = countdownData;

  const getStatusMessage = () => {
    if (isOverdueFlag) {
      return 'Your baby is ready to meet you!';
    }
    if (isTermTime) {
      return 'Full term - baby could arrive any day!';
    }
    if (isCloseToTerm) {
      return 'Almost there - final preparations!';
    }
    if (currentWeek >= 20) {
      return 'Halfway milestone passed!';
    }
    return 'Your journey continues...';
  };

  const getCountdownColor = () => {
    if (isOverdueFlag) return 'overdue';
    if (isTermTime) return 'term';
    if (isCloseToTerm) return 'close';
    return 'normal';
  };

  const renderDefaultView = () => (
    <div className={`${styles.countdown} ${styles.default} ${styles[getCountdownColor()]} ${className}`}>
      {showConfetti && <div className={styles.confetti}></div>}
      
      <div className={styles.header}>
        <div className={styles.icon}>
          {isOverdueFlag ? <Baby /> : isTermTime ? <Heart /> : <Calendar />}
        </div>
        <div className={styles.headerText}>
          <h3 className={styles.title}>
            {isOverdueFlag ? 'Overdue' : 'Due Date Countdown'}
          </h3>
          <span className={styles.status}>{getStatusMessage()}</span>
        </div>
      </div>

      <div className={styles.timeDisplay}>
        {totalDays > 30 ? (
          <div className={styles.timeUnit}>
            <span className={styles.number}>{months}</span>
            <span className={styles.label}>month{months !== 1 ? 's' : ''}</span>
          </div>
        ) : (
          <>
            {weeks > 0 && (
              <div className={styles.timeUnit}>
                <span className={styles.number}>{weeks}</span>
                <span className={styles.label}>week{weeks !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className={styles.timeUnit}>
              <span className={styles.number}>{days}</span>
              <span className={styles.label}>day{days !== 1 ? 's' : ''}</span>
            </div>
          </>
        )}
      </div>

      {showWeeks && (
        <div className={styles.weekInfo}>
          <span className={styles.currentWeek}>
            Currently {formatPregnancyWeek(currentWeek)} pregnant
          </span>
          {isFullTermFlag && (
            <span className={styles.fullTermBadge}>Full Term</span>
          )}
        </div>
      )}
    </div>
  );

  const renderDetailedView = () => (
    <div className={`${styles.countdown} ${styles.detailed} ${styles[getCountdownColor()]} ${className}`}>
      {showConfetti && <div className={styles.confetti}></div>}
      
      <div className={styles.detailedHeader}>
        <div className={styles.mainInfo}>
          <h2 className={styles.detailedTitle}>
            {isOverdueFlag ? 'Baby is Ready!' : 'Countdown to Your Baby'}
          </h2>
          <span className={styles.dueDateText}>
            Due: {dueDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className={styles.statusBadge}>
          <span className={styles.statusText}>{getStatusMessage()}</span>
        </div>
      </div>

      <div className={styles.detailedTimeDisplay}>
        <div className={styles.primaryTime}>
          <div className={styles.largeNumber}>
            {isOverdueFlag ? `+${totalDays}` : totalDays}
          </div>
          <div className={styles.largeLabel}>
            day{totalDays !== 1 ? 's' : ''} {isOverdueFlag ? 'overdue' : 'to go'}
          </div>
        </div>

        <div className={styles.timeBreakdown}>
          {totalDays > 7 && (
            <div className={styles.timeSegment}>
              <span className={styles.segmentNumber}>{weeks}</span>
              <span className={styles.segmentLabel}>weeks</span>
            </div>
          )}
          <div className={styles.timeSegment}>
            <span className={styles.segmentNumber}>{days}</span>
            <span className={styles.segmentLabel}>days</span>
          </div>
        </div>
      </div>

      <div className={styles.milestoneInfo}>
        <div className={styles.currentWeekDisplay}>
          <Clock className={styles.weekIcon} />
          <span>Week {currentWeek} of pregnancy</span>
        </div>
        {isFullTermFlag && (
          <div className={styles.fullTermDisplay}>
            <Sparkles className={styles.termIcon} />
            <span>Full term reached!</span>
          </div>
        )}
      </div>

      {showProgress && (
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            Pregnancy Progress
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${Math.min(100, (currentWeek / 40) * 100)}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {Math.round((currentWeek / 40) * 100)}% Complete
          </div>
        </div>
      )}
    </div>
  );

  const renderCompactView = () => (
    <div className={`${styles.countdown} ${styles.compact} ${styles[getCountdownColor()]} ${className}`}>
      <div className={styles.compactContent}>
        <div className={styles.compactTime}>
          <span className={styles.compactNumber}>
            {isOverdueFlag ? `+${totalDays}` : totalDays}
          </span>
          <span className={styles.compactLabel}>
            day{totalDays !== 1 ? 's' : ''}
          </span>
        </div>
        <div className={styles.compactStatus}>
          {isOverdueFlag ? 'Overdue' : 'Until due date'}
        </div>
      </div>
    </div>
  );

  const renderCelebrationView = () => (
    <div className={`${styles.countdown} ${styles.celebration} ${styles[getCountdownColor()]} ${className}`}>
      <div className={styles.celebrationContent}>
        {animated && <div className={styles.celebrationConfetti}></div>}
        
        <div className={styles.celebrationHeader}>
          <div className={styles.celebrationIcon}>
            {isOverdueFlag ? <Baby /> : <Heart />}
          </div>
          <h2 className={styles.celebrationTitle}>
            {isOverdueFlag ? 'Your Baby Awaits!' : 'Almost Time!'}
          </h2>
        </div>

        <div className={styles.celebrationTime}>
          <div className={styles.bigNumber}>
            {isOverdueFlag ? `+${totalDays}` : totalDays}
          </div>
          <div className={styles.bigLabel}>
            {isOverdueFlag ? 'Days Past Due' : 'Days to Go'}
          </div>
        </div>

        <div className={styles.celebrationMessage}>
          <Sparkles className={styles.messageIcon} />
          <span>{getStatusMessage()}</span>
        </div>
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'detailed':
      return renderDetailedView();
    case 'compact':
      return renderCompactView();
    case 'celebration':
      return renderCelebrationView();
    default:
      return renderDefaultView();
  }
}

export default DueDateCountdown;