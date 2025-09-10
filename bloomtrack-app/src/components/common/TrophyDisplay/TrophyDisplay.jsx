import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../../../context/AchievementsContext';
import Trophy from '../Trophy';
import AwardRibbon from '../AwardRibbon';
import Button from '../Button';
import Modal from '../Modal';
import styles from './TrophyDisplay.module.css';

const TrophyDisplay = ({ 
  showRibbons = true, 
  maxRibbons = 6, 
  className = '' 
}) => {
  const { 
    trophies, 
    awards, 
    progressToNextTrophy, 
    ribbonsToNextTrophy,
    totalAwards,
    totalTrophies,
    markTrophyAsSeen,
    markAwardAsSeen
  } = useAchievements();

  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [showAllRibbons, setShowAllRibbons] = useState(false);

  const handleTrophyClick = (trophy) => {
    setSelectedTrophy(trophy);
    markTrophyAsSeen(trophy.id);
  };

  const handleRibbonClick = (award) => {
    markAwardAsSeen(award.id);
  };

  const displayedRibbons = showRibbons 
    ? (showAllRibbons ? awards : awards.slice(0, maxRibbons))
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const nextTrophyLevel = ribbonsToNextTrophy > 0 ? ribbonsToNextTrophy + totalAwards : null;

  return (
    <motion.div
      className={`${styles.trophyDisplay} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className={styles.header} variants={itemVariants}>
        <h2 className={styles.title}>🏆 Your Achievements</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalTrophies}</span>
            <span className={styles.statLabel}>Trophies</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalAwards}</span>
            <span className={styles.statLabel}>Ribbons</span>
          </div>
        </div>
      </motion.div>

      {/* Trophy Section */}
      <motion.div className={styles.trophySection} variants={itemVariants}>
        <h3 className={styles.sectionTitle}>🏆 Trophy Collection</h3>
        
        {trophies.length > 0 ? (
          <div className={styles.trophyGrid}>
            {trophies.map((trophy) => (
              <Trophy
                key={trophy.id}
                trophy={trophy}
                size="medium"
                onClick={() => handleTrophyClick(trophy)}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏆</div>
            <h4>No Trophies Yet</h4>
            <p>Earn 10 ribbons to unlock your first Ruby Trophy!</p>
          </div>
        )}

        {/* Next Trophy Progress */}
        {nextTrophyLevel && (
          <motion.div className={styles.progressSection} variants={itemVariants}>
            <h4 className={styles.progressTitle}>
              Next Trophy Progress
            </h4>
            <div className={styles.progressInfo}>
              <span>{ribbonsToNextTrophy} more ribbons needed</span>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextTrophy}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className={styles.progressPercent}>
                {Math.round(progressToNextTrophy)}%
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Ribbon Section */}
      {showRibbons && (
        <motion.div className={styles.ribbonSection} variants={itemVariants}>
          <div className={styles.ribbonHeader}>
            <h3 className={styles.sectionTitle}>🎗️ Recent Ribbons</h3>
            {awards.length > maxRibbons && (
              <Button
                variant="text"
                size="small"
                onClick={() => setShowAllRibbons(!showAllRibbons)}
              >
                {showAllRibbons ? 'Show Less' : `Show All (${awards.length})`}
              </Button>
            )}
          </div>

          {displayedRibbons.length > 0 ? (
            <div className={styles.ribbonGrid}>
              {displayedRibbons.map((award, index) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AwardRibbon
                    award={award}
                    size="small"
                    showDetails={false}
                    onClick={() => handleRibbonClick(award)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎗️</div>
              <h4>No Ribbons Yet</h4>
              <p>Start journaling and celebrating milestones to earn your first ribbons!</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Achievement Tips */}
      {totalAwards === 0 && (
        <motion.div className={styles.tipsSection} variants={itemVariants}>
          <h4 className={styles.tipsTitle}>💡 How to Earn Achievements</h4>
          <ul className={styles.tipsList}>
            <li>📝 Write your first journal entry</li>
            <li>🎯 Celebrate pregnancy milestones</li>
            <li>🔥 Keep a journaling streak going</li>
            <li>📸 Add photos to your milestones</li>
            <li>💖 Track your mood regularly</li>
            <li>✍️ Write 100+ words to unlock special ribbons</li>
          </ul>
        </motion.div>
      )}

      {/* Trophy Detail Modal */}
      <AnimatePresence>
        {selectedTrophy && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedTrophy(null)}
            title="Trophy Details"
          >
            <div className={styles.trophyModal}>
              <Trophy
                trophy={selectedTrophy}
                size="large"
                showDetails={true}
              />
              <div className={styles.trophyInfo}>
                <h3>{selectedTrophy.title}</h3>
                <p>{selectedTrophy.description}</p>
                <div className={styles.trophyMeta}>
                  <span>Required: {selectedTrophy.ribbonsRequired} ribbons</span>
                  {selectedTrophy.earnedAt && (
                    <span>
                      Earned: {new Date(selectedTrophy.earnedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TrophyDisplay;