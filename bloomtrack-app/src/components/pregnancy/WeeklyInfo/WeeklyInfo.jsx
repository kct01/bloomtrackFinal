import { useMemo } from 'react';
import styles from './WeeklyInfo.module.css';
import { Baby, Heart, Sparkles, Calendar, Info } from 'lucide-react';
import { 
  getCurrentTrimester, 
  getTrimesterInfo,
  estimateBabyWeight,
  estimateBabyLength,
  formatPregnancyWeek 
} from '../../../utils/pregnancyCalculations';

/**
 * WeeklyInfo Component
 * Displays detailed information about the current pregnancy week including baby development
 */
function WeeklyInfo({ 
  currentWeek = 1,
  weekData = null,
  variant = 'detailed', // 'detailed', 'compact', 'card'
  showBabySize = true,
  showDevelopment = true,
  showMaternalChanges = true,
  showTips = true,
  className = ''
}) {
  const currentTrimester = getCurrentTrimester(currentWeek);
  const trimesterInfo = getTrimesterInfo(currentTrimester);
  const babyWeight = estimateBabyWeight(currentWeek);
  const babyLength = estimateBabyLength(currentWeek);

  // Default week data if not provided
  const defaultWeekData = useMemo(() => ({
    babySize: getBabySizeComparison(currentWeek),
    sizeInches: babyLength,
    developmentMilestones: getDevelopmentMilestones(currentWeek),
    maternalChanges: getMaternalChanges(currentWeek),
    tipsAndAdvice: getWeeklyTips(currentWeek)
  }), [currentWeek, babyLength]);

  const displayData = weekData || defaultWeekData;

  // Helper function to get baby size comparison
  function getBabySizeComparison(week) {
    const comparisons = {
      4: 'Poppy seed',
      5: 'Sesame seed',
      6: 'Lentil',
      7: 'Blueberry',
      8: 'Kidney bean',
      9: 'Grape',
      10: 'Prune',
      11: 'Lime',
      12: 'Plum',
      13: 'Peach',
      14: 'Lemon',
      15: 'Apple',
      16: 'Avocado',
      17: 'Turnip',
      18: 'Bell pepper',
      19: 'Tomato',
      20: 'Banana',
      21: 'Carrot',
      22: 'Spaghetti squash',
      23: 'Large mango',
      24: 'Ear of corn',
      25: 'Rutabaga',
      26: 'Scallion bunch',
      27: 'Head of lettuce',
      28: 'Eggplant',
      29: 'Butternut squash',
      30: 'Large cabbage',
      31: 'Coconut',
      32: 'Jicama',
      33: 'Pineapple',
      34: 'Cantaloupe',
      35: 'Honeydew melon',
      36: 'Romaine lettuce',
      37: 'Swiss chard',
      38: 'Leek',
      39: 'Mini watermelon',
      40: 'Small pumpkin'
    };
    
    return comparisons[week] || comparisons[Math.min(40, Math.max(4, week))] || 'Growing baby';
  }

  // Helper function to get development milestones
  function getDevelopmentMilestones(week) {
    const milestones = {
      4: ['Neural tube forms', 'Heart begins to beat'],
      8: ['All major organs present', 'Limbs are growing'],
      12: ['Fingernails developing', 'Can make fists'],
      16: ['Can hear sounds', 'Growing rapidly'],
      20: ['Halfway point!', 'Anatomy scan time'],
      24: ['Hearing improves', 'Lungs developing'],
      28: ['Eyes can open', 'Brain activity increases'],
      32: ['Bones hardening', 'Preparing for birth'],
      36: ['Considered full-term soon', 'Head positioning'],
      40: ['Ready for birth!', 'Fully developed']
    };

    const closest = Object.keys(milestones)
      .map(Number)
      .reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
    
    return milestones[closest] || ['Continuing to grow and develop', 'Getting stronger every day'];
  }

  // Helper function to get maternal changes
  function getMaternalChanges(week) {
    const changes = {
      4: ['You might notice pregnancy symptoms', 'Take a pregnancy test'],
      8: ['Morning sickness may begin', 'Breast tenderness'],
      12: ['Energy may improve', 'Morning sickness may ease'],
      16: ['You might feel baby move soon', 'Growing belly'],
      20: ['Feeling baby movements', 'Showing more clearly'],
      24: ['Glucose screening time', 'Back pain may increase'],
      28: ['Third trimester begins', 'More frequent checkups'],
      32: ['Braxton Hicks contractions', 'Shortness of breath'],
      36: ['Weekly checkups begin', 'Preparing for labor'],
      40: ['Ready for delivery', 'Labor could start anytime']
    };

    const closest = Object.keys(changes)
      .map(Number)
      .reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
    
    return changes[closest] || ['Body continues to change', 'Stay comfortable and rest'];
  }

  // Helper function to get weekly tips
  function getWeeklyTips(week) {
    const tips = {
      4: ['Start taking prenatal vitamins', 'Avoid alcohol and smoking'],
      8: ['Schedule first prenatal appointment', 'Eat small, frequent meals'],
      12: ['Consider genetic screening', 'Start telling family and friends'],
      16: ['Schedule anatomy ultrasound', 'Start thinking about nursery'],
      20: ['Take anatomy scan photos', 'Consider maternity photos'],
      24: ['Take glucose tolerance test', 'Start counting baby kicks'],
      28: ['Begin birth classes', 'Tour birth facility'],
      32: ['Start birth plan discussions', 'Pack hospital bag'],
      36: ['Finalize birth plan', 'Rest and prepare'],
      40: ['Stay calm and ready', 'Call doctor when labor starts']
    };

    const closest = Object.keys(tips)
      .map(Number)
      .reduce((prev, curr) => Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev);
    
    return tips[closest] || ['Continue healthy habits', 'Stay hydrated and rest'];
  }

  const renderDetailedView = () => (
    <div className={`${styles.weeklyInfo} ${styles.detailed} ${className}`}>
      <div className={styles.header}>
        <div className={styles.weekTitle}>
          <Calendar className={styles.icon} />
          <span className={styles.weekNumber}>Week {currentWeek}</span>
          <span className={styles.trimesterBadge} style={{ backgroundColor: trimesterInfo?.color }}>
            {trimesterInfo?.name}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        {showBabySize && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Baby className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Baby Development</h3>
            </div>
            <div className={styles.babySize}>
              <div className={styles.sizeComparison}>
                <span className={styles.sizeText}>Size of a</span>
                <span className={styles.sizeName}>{displayData.babySize}</span>
              </div>
              <div className={styles.measurements}>
                <span className={styles.measurement}>Length: {displayData.sizeInches}</span>
                <span className={styles.measurement}>Weight: {babyWeight}</span>
              </div>
            </div>
          </div>
        )}

        {showDevelopment && displayData.developmentMilestones && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Sparkles className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Development Milestones</h3>
            </div>
            <ul className={styles.milestoneList}>
              {displayData.developmentMilestones.map((milestone, index) => (
                <li key={index} className={styles.milestone}>
                  <span className={styles.milestoneText}>{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showMaternalChanges && displayData.maternalChanges && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heart className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Your Changes</h3>
            </div>
            <ul className={styles.changesList}>
              {displayData.maternalChanges.map((change, index) => (
                <li key={index} className={styles.change}>
                  <span className={styles.changeText}>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showTips && displayData.tipsAndAdvice && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Info className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Tips & Advice</h3>
            </div>
            <ul className={styles.tipsList}>
              {displayData.tipsAndAdvice.map((tip, index) => (
                <li key={index} className={styles.tip}>
                  <span className={styles.tipText}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompactView = () => (
    <div className={`${styles.weeklyInfo} ${styles.compact} ${className}`}>
      <div className={styles.compactHeader}>
        <span className={styles.weekNumber}>Week {currentWeek}</span>
        <span className={styles.babySize}>{displayData.babySize}</span>
      </div>
      
      {displayData.developmentMilestones && displayData.developmentMilestones[0] && (
        <div className={styles.compactContent}>
          <span className={styles.highlightMilestone}>
            {displayData.developmentMilestones[0]}
          </span>
        </div>
      )}
    </div>
  );

  const renderCardView = () => (
    <div className={`${styles.weeklyInfo} ${styles.card} ${className}`}>
      <div className={styles.cardHeader}>
        <div className={styles.weekTitle}>
          <span className={styles.weekNumber}>Week {currentWeek}</span>
          <span className={styles.trimesterBadge} style={{ backgroundColor: trimesterInfo?.color }}>
            T{currentTrimester}
          </span>
        </div>
        <div className={styles.babySize}>
          <Baby className={styles.babySizeIcon} />
          <span className={styles.sizeName}>{displayData.babySize}</span>
        </div>
      </div>

      <div className={styles.cardContent}>
        {displayData.developmentMilestones && displayData.developmentMilestones[0] && (
          <div className={styles.keyMilestone}>
            <Sparkles className={styles.milestoneIcon} />
            <span className={styles.milestoneText}>
              {displayData.developmentMilestones[0]}
            </span>
          </div>
        )}
        
        {displayData.tipsAndAdvice && displayData.tipsAndAdvice[0] && (
          <div className={styles.keyTip}>
            <Info className={styles.tipIcon} />
            <span className={styles.tipText}>
              {displayData.tipsAndAdvice[0]}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'detailed':
      return renderDetailedView();
    case 'compact':
      return renderCompactView();
    case 'card':
      return renderCardView();
    default:
      return renderDetailedView();
  }
}

export default WeeklyInfo;