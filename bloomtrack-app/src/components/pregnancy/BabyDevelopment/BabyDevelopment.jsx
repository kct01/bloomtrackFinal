import { useMemo } from 'react';
import styles from './BabyDevelopment.module.css';
import { Baby, Heart, Brain, Activity, Eye, Ear, Scale, Ruler } from 'lucide-react';
import { 
  getCurrentTrimester, 
  getTrimesterInfo,
  estimateBabyWeight,
  estimateBabyLength 
} from '../../../utils/pregnancyCalculations';

/**
 * BabyDevelopment Component
 * Displays detailed baby development information for current pregnancy week
 */
function BabyDevelopment({ 
  currentWeek = 1,
  variant = 'detailed', // 'detailed', 'card', 'timeline', 'compact'
  showSize = true,
  showMilestones = true,
  showOrgans = true,
  showSenses = true,
  animated = true,
  className = ''
}) {
  const currentTrimester = getCurrentTrimester(currentWeek);
  const trimesterInfo = getTrimesterInfo(currentTrimester);
  const babyWeight = estimateBabyWeight(currentWeek);
  const babyLength = estimateBabyLength(currentWeek);

  // Comprehensive baby development data
  const developmentData = useMemo(() => {
    const data = {
      4: {
        size: { length: '2mm', weight: '0.4g', comparison: 'Poppy seed' },
        majorDevelopments: ['Neural tube forms', 'Heart begins to beat', 'Limb buds appear'],
        organs: ['Heart tube', 'Neural tube', 'Primitive gut'],
        senses: ['None yet developed'],
        movements: ['No voluntary movements'],
        highlights: ['Pregnancy begins!', 'First heartbeats']
      },
      8: {
        size: { length: '1.6cm', weight: '1g', comparison: 'Kidney bean' },
        majorDevelopments: ['All major organs present', 'Limbs growing rapidly', 'Face features forming'],
        organs: ['Heart with 4 chambers', 'Brain developing', 'Kidneys functioning'],
        senses: ['Basic nervous system', 'Taste buds forming'],
        movements: ['Spontaneous movements begin'],
        highlights: ['First doctor visit', 'Organs all present']
      },
      12: {
        size: { length: '5.4cm', weight: '14g', comparison: 'Lime' },
        majorDevelopments: ['End of first trimester', 'Fingernails developing', 'Can make fists'],
        organs: ['Digestive system working', 'Bone marrow producing blood', 'Liver functioning'],
        senses: ['Can respond to touch', 'Vocal cords forming'],
        movements: ['Active movement', 'Can kick and stretch'],
        highlights: ['End of first trimester!', 'Lower miscarriage risk']
      },
      16: {
        size: { length: '11.6cm', weight: '100g', comparison: 'Avocado' },
        majorDevelopments: ['Rapid growth period', 'Hearing developing', 'Genetic testing possible'],
        organs: ['Heart pumping 25 quarts daily', 'Nervous system functioning', 'Muscles strengthening'],
        senses: ['Can hear muffled sounds', 'Eyes moving', 'Facial expressions'],
        movements: ['You might feel movement soon', 'Coordinated limb movements'],
        highlights: ['Anatomy scan coming up', 'Gender may be visible']
      },
      20: {
        size: { length: '16.4cm', weight: '300g', comparison: 'Banana' },
        majorDevelopments: ['Halfway point!', 'Brain growing rapidly', 'Hair and nails growing'],
        organs: ['Lungs developing', 'Digestive system maturing', 'Immune system developing'],
        senses: ['Can hear your voice', 'Eyes can detect light', 'Taste preferences forming'],
        movements: ['Regular movement patterns', 'Response to sounds', 'Sleep cycles'],
        highlights: ['Halfway milestone!', 'Anatomy scan reveals details']
      },
      24: {
        size: { length: '21cm', weight: '600g', comparison: 'Ear of corn' },
        majorDevelopments: ['Viability milestone', 'Lung development crucial', 'Brain waves detectable'],
        organs: ['Lungs producing surfactant', 'Brain development accelerating', 'Inner ear complete'],
        senses: ['Hearing well developed', 'Responds to light and sound', 'Sense of balance'],
        movements: ['Strong kicks', 'Regular sleep patterns', 'Hiccups common'],
        highlights: ['Viability reached!', 'Glucose screening time']
      },
      28: {
        size: { length: '25.4cm', weight: '1kg', comparison: 'Eggplant' },
        majorDevelopments: ['Third trimester begins', 'Eyes can open', 'Brain tissue increasing'],
        organs: ['Lung development progressing', 'Fat deposits forming', 'Bone marrow controls blood production'],
        senses: ['Can see light through skin', 'Hearing nearly complete', 'Taste buds mature'],
        movements: ['Less room to move', 'Regular sleep-wake cycles', 'Response to music'],
        highlights: ['Third trimester starts!', 'Baby can survive outside womb']
      },
      32: {
        size: { length: '28.9cm', weight: '1.7kg', comparison: 'Jicama' },
        majorDevelopments: ['Rapid weight gain', 'Immune system developing', 'Practicing breathing'],
        organs: ['Bones hardening except skull', 'Kidneys fully functional', 'Liver storing iron'],
        senses: ['All senses functional', 'Learning and memory developing', 'Recognizes your voice'],
        movements: ['Stronger but less frequent kicks', 'Head may be down', 'Practice breathing movements'],
        highlights: ['Baby shower time!', 'Regular check-ups begin']
      },
      36: {
        size: { length: '32.2cm', weight: '2.6kg', comparison: 'Romaine lettuce' },
        majorDevelopments: ['Considered full-term soon', 'Lungs nearly mature', 'Fat accumulation'],
        organs: ['Digestive system ready', 'Immune system strengthening', 'Liver and kidneys functioning'],
        senses: ['Vision about 20/400', 'Can distinguish voices', 'Responds to music and speech'],
        movements: ['Less space for big movements', 'May be head-down', 'Preparing for birth'],
        highlights: ['Almost full-term!', 'Weekly check-ups start']
      },
      40: {
        size: { length: '35.6cm', weight: '3.4kg', comparison: 'Small pumpkin' },
        majorDevelopments: ['Ready for birth!', 'Fully developed', 'Waiting for labor'],
        organs: ['All systems mature', 'Lungs ready for breathing', 'Digestive system complete'],
        senses: ['All senses fully developed', 'Can see, hear, taste, smell', 'Recognizes parents\' voices'],
        movements: ['Limited movement due to space', 'Strong grip', 'Ready to meet you!'],
        highlights: ['Due date arrived!', 'Baby ready for outside world']
      }
    };

    // Find closest week with data
    const weeks = Object.keys(data).map(Number).sort((a, b) => a - b);
    const closestWeek = weeks.reduce((prev, curr) => 
      Math.abs(curr - currentWeek) < Math.abs(prev - currentWeek) ? curr : prev
    );

    return data[closestWeek] || data[4];
  }, [currentWeek]);

  const getWeekIcon = (week) => {
    if (week <= 12) return <Heart className={styles.weekIcon} />;
    if (week <= 27) return <Brain className={styles.weekIcon} />;
    return <Baby className={styles.weekIcon} />;
  };

  const renderDetailedView = () => (
    <div className={`${styles.babyDevelopment} ${styles.detailed} ${className}`}>
      <div className={styles.header}>
        <div className={styles.weekInfo}>
          {getWeekIcon(currentWeek)}
          <div className={styles.weekDetails}>
            <h2 className={styles.title}>Week {currentWeek} Development</h2>
            <span className={styles.trimester}>{trimesterInfo?.name}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {showSize && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Scale className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Baby's Size</h3>
            </div>
            <div className={styles.sizeDisplay}>
              <div className={styles.comparison}>
                <span className={styles.comparisonText}>Size of a</span>
                <span className={styles.comparisonItem}>{developmentData.size.comparison}</span>
              </div>
              <div className={styles.measurements}>
                <div className={styles.measurement}>
                  <Ruler className={styles.measurementIcon} />
                  <span className={styles.measurementLabel}>Length</span>
                  <span className={styles.measurementValue}>{developmentData.size.length}</span>
                </div>
                <div className={styles.measurement}>
                  <Scale className={styles.measurementIcon} />
                  <span className={styles.measurementLabel}>Weight</span>
                  <span className={styles.measurementValue}>{developmentData.size.weight}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showMilestones && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Activity className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Major Developments</h3>
            </div>
            <ul className={styles.developmentList}>
              {developmentData.majorDevelopments.map((development, index) => (
                <li key={index} className={styles.developmentItem}>
                  <span className={styles.developmentText}>{development}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showOrgans && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Heart className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Organ Development</h3>
            </div>
            <ul className={styles.organList}>
              {developmentData.organs.map((organ, index) => (
                <li key={index} className={styles.organItem}>
                  <span className={styles.organText}>{organ}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showSenses && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Eye className={styles.sectionIcon} />
              <h3 className={styles.sectionTitle}>Senses & Movement</h3>
            </div>
            <div className={styles.sensesGrid}>
              <div className={styles.sensesCategory}>
                <h4 className={styles.categoryTitle}>Senses</h4>
                <ul className={styles.sensesList}>
                  {developmentData.senses.map((sense, index) => (
                    <li key={index} className={styles.senseItem}>
                      <Ear className={styles.senseIcon} />
                      <span>{sense}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.sensesCategory}>
                <h4 className={styles.categoryTitle}>Movements</h4>
                <ul className={styles.movementsList}>
                  {developmentData.movements.map((movement, index) => (
                    <li key={index} className={styles.movementItem}>
                      <Activity className={styles.movementIcon} />
                      <span>{movement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className={styles.highlights}>
          <div className={styles.highlightsHeader}>
            <h3 className={styles.highlightsTitle}>Week {currentWeek} Highlights</h3>
          </div>
          <div className={styles.highlightsList}>
            {developmentData.highlights.map((highlight, index) => (
              <div key={index} className={styles.highlight}>
                <span className={styles.highlightIcon}>(</span>
                <span className={styles.highlightText}>{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCardView = () => (
    <div className={`${styles.babyDevelopment} ${styles.card} ${className}`}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          {getWeekIcon(currentWeek)}
          <span>Week {currentWeek}</span>
        </div>
        <div className={styles.cardSize}>
          <Baby className={styles.cardSizeIcon} />
          <span>{developmentData.size.comparison}</span>
        </div>
      </div>
      
      <div className={styles.cardContent}>
        <div className={styles.keyDevelopment}>
          <Activity className={styles.keyIcon} />
          <span>{developmentData.majorDevelopments[0]}</span>
        </div>
        
        {developmentData.highlights[0] && (
          <div className={styles.keyHighlight}>
            <span className={styles.highlightIcon}>(</span>
            <span>{developmentData.highlights[0]}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCompactView = () => (
    <div className={`${styles.babyDevelopment} ${styles.compact} ${className}`}>
      <div className={styles.compactContent}>
        <div className={styles.compactInfo}>
          <span className={styles.compactWeek}>Week {currentWeek}</span>
          <span className={styles.compactSize}>{developmentData.size.comparison}</span>
        </div>
        <div className={styles.compactDevelopment}>
          {developmentData.majorDevelopments[0]}
        </div>
      </div>
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'card':
      return renderCardView();
    case 'compact':
      return renderCompactView();
    case 'detailed':
    default:
      return renderDetailedView();
  }
}

export default BabyDevelopment;