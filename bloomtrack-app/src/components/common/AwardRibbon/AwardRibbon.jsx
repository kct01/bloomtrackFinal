import React from 'react';
import { motion } from 'framer-motion';
import styles from './AwardRibbon.module.css';
import { WORD_COUNT_RIBBONS } from '../../../context/AchievementsContext';

const RIBBON_TYPES = {
  // Journaling Awards
  FIRST_JOURNAL: {
    id: 'first_journal',
    title: 'First Journal Entry',
    description: 'Started your pregnancy journey documentation',
    icon: '📝',
    color: 'bronze',
    category: 'journaling'
  },
  JOURNAL_STREAK_7: {
    id: 'journal_streak_7',
    title: 'Week Warrior',
    description: '7 days of consecutive journaling',
    icon: '🔥',
    color: 'silver',
    category: 'journaling'
  },
  JOURNAL_STREAK_30: {
    id: 'journal_streak_30',
    title: 'Monthly Chronicler',
    description: '30 days of consistent journaling',
    icon: '📚',
    color: 'gold',
    category: 'journaling'
  },
  JOURNAL_TOTAL_50: {
    id: 'journal_total_50',
    title: 'Pregnancy Poet',
    description: '50 total journal entries',
    icon: '✍️',
    color: 'platinum',
    category: 'journaling'
  },
  
  // Milestone Awards
  FIRST_MILESTONE: {
    id: 'first_milestone',
    title: 'First Milestone',
    description: 'Celebrated your first pregnancy milestone',
    icon: '🎯',
    color: 'bronze',
    category: 'milestones'
  },
  MILESTONE_PHOTOGRAPHER: {
    id: 'milestone_photographer',
    title: 'Milestone Photographer',
    description: 'Added photos to 5 milestones',
    icon: '📸',
    color: 'silver',
    category: 'milestones'
  },
  MILESTONE_ACHIEVER: {
    id: 'milestone_achiever',
    title: 'Milestone Master',
    description: 'Completed 10 pregnancy milestones',
    icon: '🏆',
    color: 'gold',
    category: 'milestones'
  },
  TRIMESTER_CHAMPION: {
    id: 'trimester_champion',
    title: 'Trimester Champion',
    description: 'Celebrated all major trimester milestones',
    icon: '👑',
    color: 'platinum',
    category: 'milestones'
  },

  // Special Awards
  FIRST_WEEK: {
    id: 'first_week',
    title: 'BloomTrack Beginner',
    description: 'Completed your first week using BloomTrack',
    icon: '🌱',
    color: 'bronze',
    category: 'special'
  },
  MOOD_TRACKER: {
    id: 'mood_tracker',
    title: 'Emotional Awareness',
    description: 'Tracked mood for 14 consecutive days',
    icon: '💖',
    color: 'silver',
    category: 'special'
  },
  PREGNANCY_GRADUATE: {
    id: 'pregnancy_graduate',
    title: 'Pregnancy Graduate',
    description: 'Successfully tracked entire pregnancy journey',
    icon: '🎓',
    color: 'diamond',
    category: 'special'
  }
};

const AwardRibbon = ({ 
  award, 
  size = 'medium', 
  showDetails = true, 
  isNew = false,
  onClick,
  className = ''
}) => {
  const ribbonInfo = RIBBON_TYPES[award.type] || WORD_COUNT_RIBBONS[award.type] || award;

  const ribbonVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      rotateY: -90 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.05,
      rotateY: 10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const newBadgeVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`${styles.ribbonContainer} ${styles[size]} ${styles[ribbonInfo.color]} ${className}`}
      variants={ribbonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${ribbonInfo.title} award: ${ribbonInfo.description}`}
    >
      {/* New Badge */}
      {isNew && (
        <motion.div 
          className={styles.newBadge}
          variants={newBadgeVariants}
          animate="pulse"
        >
          NEW!
        </motion.div>
      )}

      {/* Ribbon Shape */}
      <div className={styles.ribbon}>
        <div className={styles.ribbonTop}>
          <div className={styles.iconContainer}>
            <span className={styles.ribbonIcon} role="img" aria-hidden="true">
              {ribbonInfo.icon}
            </span>
          </div>
        </div>
        
        <div className={styles.ribbonBody}>
          {showDetails && (
            <>
              <h3 className={styles.ribbonTitle}>{ribbonInfo.title}</h3>
              <p className={styles.ribbonDescription}>{ribbonInfo.description}</p>
            </>
          )}
        </div>
        
        <div className={styles.ribbonTails}>
          <div className={styles.ribbonTail}></div>
          <div className={styles.ribbonTail}></div>
        </div>
      </div>

      {/* Award Date */}
      {award.earnedAt && showDetails && (
        <div className={styles.awardDate}>
          Earned {new Date(award.earnedAt).toLocaleDateString()}
        </div>
      )}

      {/* Sparkle Effects */}
      <div className={styles.sparkles}>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
        <div className={styles.sparkle}></div>
      </div>
    </motion.div>
  );
};

// Export ribbon types for use in other components
export { RIBBON_TYPES };
export default AwardRibbon;