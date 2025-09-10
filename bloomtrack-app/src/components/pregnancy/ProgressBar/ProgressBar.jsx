import { useMemo } from 'react';
import styles from './ProgressBar.module.css';
import { 
  getCurrentTrimester, 
  calculatePregnancyProgress,
  calculateTrimesterProgress,
  getTrimesterInfo 
} from '../../../utils/pregnancyCalculations';

/**
 * ProgressBar Component
 * Displays pregnancy progress with trimester color coding and animations
 */
function ProgressBar({ 
  currentWeek = 1, 
  variant = 'overall', // 'overall', 'trimester', 'mini'
  showLabels = true,
  showWeeks = true,
  animated = true,
  className = ''
}) {
  const currentTrimester = getCurrentTrimester(currentWeek);
  const overallProgress = calculatePregnancyProgress(currentWeek);
  const trimesterProgress = calculateTrimesterProgress(currentWeek, currentTrimester);
  const trimesterInfo = getTrimesterInfo(currentTrimester);

  // Calculate progress for each trimester
  const trimesterProgresses = useMemo(() => ({
    1: calculateTrimesterProgress(currentWeek, 1),
    2: calculateTrimesterProgress(currentWeek, 2),
    3: calculateTrimesterProgress(currentWeek, 3)
  }), [currentWeek]);

  const renderOverallProgress = () => (
    <div className={`${styles.progressContainer} ${styles.overall} ${className}`}>
      {showLabels && (
        <div className={styles.header}>
          <span className={styles.label}>Pregnancy Progress</span>
          {showWeeks && (
            <span className={styles.weekInfo}>
              Week {currentWeek} of 40
            </span>
          )}
        </div>
      )}
      
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${styles[`trimester${currentTrimester}`]} ${animated ? styles.animated : ''}`}
          style={{ width: `${overallProgress}%` }}
        >
          <div className={styles.progressGlow}></div>
        </div>
        
        {/* Trimester markers */}
        <div className={styles.trimesterMarkers}>
          <div className={styles.marker} style={{ left: '30%' }}>
            <div className={styles.markerLine}></div>
            <span className={styles.markerLabel}>T1</span>
          </div>
          <div className={styles.marker} style={{ left: '67.5%' }}>
            <div className={styles.markerLine}></div>
            <span className={styles.markerLabel}>T2</span>
          </div>
        </div>
      </div>

      {showLabels && (
        <div className={styles.footer}>
          <span className={styles.progressText}>
            {Math.round(overallProgress)}% Complete
          </span>
          <span className={styles.trimesterText}>
            {trimesterInfo?.name}
          </span>
        </div>
      )}
    </div>
  );

  const renderTrimesterProgress = () => (
    <div className={`${styles.progressContainer} ${styles.trimester} ${className}`}>
      {showLabels && (
        <div className={styles.header}>
          <span className={styles.label}>{trimesterInfo?.name}</span>
          {showWeeks && (
            <span className={styles.weekInfo}>
              {trimesterInfo?.weeks} weeks
            </span>
          )}
        </div>
      )}
      
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${styles[`trimester${currentTrimester}`]} ${animated ? styles.animated : ''}`}
          style={{ width: `${trimesterProgress}%` }}
        >
          <div className={styles.progressGlow}></div>
        </div>
      </div>

      {showLabels && (
        <div className={styles.footer}>
          <span className={styles.progressText}>
            {Math.round(trimesterProgress)}% Complete
          </span>
          <span className={styles.description}>
            {trimesterInfo?.description}
          </span>
        </div>
      )}
    </div>
  );

  const renderMiniProgress = () => (
    <div className={`${styles.progressContainer} ${styles.mini} ${className}`}>
      <div className={styles.progressTrack}>
        <div 
          className={`${styles.progressFill} ${styles[`trimester${currentTrimester}`]} ${animated ? styles.animated : ''}`}
          style={{ width: `${overallProgress}%` }}
        >
          <div className={styles.progressGlow}></div>
        </div>
      </div>
      
      {showLabels && (
        <span className={styles.miniLabel}>
          Week {currentWeek} " {Math.round(overallProgress)}%
        </span>
      )}
    </div>
  );

  const renderAllTrimesters = () => (
    <div className={`${styles.progressContainer} ${styles.allTrimesters} ${className}`}>
      {showLabels && (
        <div className={styles.header}>
          <span className={styles.label}>Trimester Progress</span>
          {showWeeks && (
            <span className={styles.weekInfo}>Week {currentWeek}</span>
          )}
        </div>
      )}

      <div className={styles.trimesterGrid}>
        {[1, 2, 3].map(trimester => {
          const info = getTrimesterInfo(trimester);
          const progress = trimesterProgresses[trimester];
          const isActive = trimester === currentTrimester;
          const isCompleted = progress === 100;

          return (
            <div 
              key={trimester}
              className={`${styles.trimesterCard} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
            >
              <div className={styles.trimesterHeader}>
                <span className={styles.trimesterNumber}>{trimester}</span>
                <span className={styles.trimesterName}>{info?.name}</span>
              </div>
              
              <div className={styles.progressTrack}>
                <div 
                  className={`${styles.progressFill} ${styles[`trimester${trimester}`]} ${animated ? styles.animated : ''}`}
                  style={{ width: `${progress}%` }}
                >
                  <div className={styles.progressGlow}></div>
                </div>
              </div>
              
              <div className={styles.trimesterFooter}>
                <span className={styles.progressText}>
                  {Math.round(progress)}%
                </span>
                <span className={styles.weeksText}>
                  {info?.weeks} weeks
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'overall':
      return renderOverallProgress();
    case 'trimester':
      return renderTrimesterProgress();
    case 'mini':
      return renderMiniProgress();
    case 'all':
      return renderAllTrimesters();
    default:
      return renderOverallProgress();
  }
}

export default ProgressBar;