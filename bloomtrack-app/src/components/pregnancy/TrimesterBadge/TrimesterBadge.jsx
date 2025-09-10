import { useMemo } from 'react';
import styles from './TrimesterBadge.module.css';
import { Sparkles, Heart, Star } from 'lucide-react';
import { 
  getCurrentTrimester, 
  getTrimesterInfo,
  calculateTrimesterProgress 
} from '../../../utils/pregnancyCalculations';

/**
 * TrimesterBadge Component
 * Displays trimester information with dynamic styling and progress
 */
function TrimesterBadge({ 
  currentWeek = 1,
  variant = 'default', // 'default', 'detailed', 'mini', 'progress'
  showProgress = false,
  showIcon = true,
  showWeeks = false,
  animated = true,
  clickable = false,
  onClick = null,
  className = ''
}) {
  const currentTrimester = getCurrentTrimester(currentWeek);
  const trimesterInfo = getTrimesterInfo(currentTrimester);
  const progress = calculateTrimesterProgress(currentWeek, currentTrimester);

  // Memoized icon based on trimester
  const trimesterIcon = useMemo(() => {
    switch (currentTrimester) {
      case 1:
        return <Sparkles className={styles.icon} />;
      case 2:
        return <Heart className={styles.icon} />;
      case 3:
        return <Star className={styles.icon} />;
      default:
        return <Sparkles className={styles.icon} />;
    }
  }, [currentTrimester]);

  // Base badge component
  const BadgeContent = ({ children, extraClasses = '' }) => {
    const Component = clickable ? 'button' : 'div';
    
    return (
      <Component
        className={`
          ${styles.trimesterBadge} 
          ${styles[`trimester${currentTrimester}`]} 
          ${styles[variant]} 
          ${clickable ? styles.clickable : ''} 
          ${animated ? styles.animated : ''} 
          ${extraClasses} 
          ${className}
        `}
        onClick={clickable ? onClick : undefined}
        disabled={clickable && !onClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        aria-label={clickable ? `${trimesterInfo?.name} - Click for details` : undefined}
      >
        {children}
      </Component>
    );
  };

  const renderDefault = () => (
    <BadgeContent>
      <div className={styles.badgeContent}>
        {showIcon && trimesterIcon}
        <span className={styles.trimesterText}>
          {trimesterInfo?.name || `Trimester ${currentTrimester}`}
        </span>
        {showWeeks && (
          <span className={styles.weeksText}>
            {trimesterInfo?.weeks} weeks
          </span>
        )}
      </div>
    </BadgeContent>
  );

  const renderDetailed = () => (
    <BadgeContent extraClasses={styles.detailed}>
      <div className={styles.detailedHeader}>
        {showIcon && trimesterIcon}
        <div className={styles.trimesterInfo}>
          <span className={styles.trimesterNumber}>T{currentTrimester}</span>
          <span className={styles.trimesterName}>{trimesterInfo?.name}</span>
        </div>
      </div>
      
      <div className={styles.detailedContent}>
        <span className={styles.description}>
          {trimesterInfo?.description}
        </span>
        {showWeeks && (
          <span className={styles.weeksRange}>
            Weeks {trimesterInfo?.weeks}
          </span>
        )}
      </div>

      {showProgress && (
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {Math.round(progress)}% complete
          </span>
        </div>
      )}
    </BadgeContent>
  );

  const renderMini = () => (
    <BadgeContent extraClasses={styles.mini}>
      <div className={styles.miniContent}>
        {showIcon && (
          <div className={styles.miniIcon}>
            {trimesterIcon}
          </div>
        )}
        <span className={styles.miniText}>T{currentTrimester}</span>
      </div>
    </BadgeContent>
  );

  const renderProgress = () => (
    <BadgeContent extraClasses={styles.progressVariant}>
      <div className={styles.progressHeader}>
        {showIcon && trimesterIcon}
        <span className={styles.trimesterText}>
          {trimesterInfo?.name}
        </span>
      </div>
      
      <div className={styles.progressWrapper}>
        <div className={styles.progressTrack}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressLabel}>
          {Math.round(progress)}%
        </span>
      </div>

      {showWeeks && (
        <div className={styles.weeksInfo}>
          <span className={styles.currentWeek}>Week {currentWeek}</span>
          <span className={styles.totalWeeks}>of {trimesterInfo?.weeks}</span>
        </div>
      )}
    </BadgeContent>
  );

  // Render based on variant
  switch (variant) {
    case 'detailed':
      return renderDetailed();
    case 'mini':
      return renderMini();
    case 'progress':
      return renderProgress();
    default:
      return renderDefault();
  }
}

export default TrimesterBadge;