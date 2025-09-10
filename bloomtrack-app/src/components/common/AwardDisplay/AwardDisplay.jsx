import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../../../context/AchievementsContext';
import AwardRibbon from '../AwardRibbon';
import Modal from '../Modal';
import Button from '../Button';
import styles from './AwardDisplay.module.css';

const AwardDisplay = ({ 
  variant = 'dashboard', // 'dashboard', 'profile', 'compact'
  showNewBadges = true,
  maxVisible = 6,
  className = ''
}) => {
  const { 
    awards, 
    newAwards, 
    totalAwards, 
    markAwardAsSeen,
    getAwardsByCategory,
    getRecentAwards
  } = useAchievements();

  const [selectedAward, setSelectedAward] = useState(null);
  const [showAllAwards, setShowAllAwards] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Get awards to display based on variant
  const getDisplayAwards = () => {
    switch (variant) {
      case 'dashboard':
        return getRecentAwards(maxVisible);
      case 'profile':
        if (activeCategory === 'all') {
          return awards;
        }
        return getAwardsByCategory(activeCategory);
      case 'compact':
        return getRecentAwards(3);
      default:
        return awards;
    }
  };

  const displayAwards = getDisplayAwards();
  const categories = ['all', 'journaling', 'milestones', 'special'];

  const handleAwardClick = (award) => {
    setSelectedAward(award);
    if (newAwards.find(newAward => newAward.id === award.id)) {
      markAwardAsSeen(award.id);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const ribbonVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  if (awards.length === 0) {
    return (
      <div className={`${styles.awardDisplay} ${styles[variant]} ${className}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏆</div>
          <h3 className={styles.emptyTitle}>Start Your Achievement Journey!</h3>
          <p className={styles.emptyMessage}>
            Complete your first journal entry or milestone to earn your first award ribbon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.awardDisplay} ${styles[variant]} ${className}`}>
      {/* Header */}
      {variant !== 'compact' && (
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h3 className={styles.title}>
              {variant === 'dashboard' ? 'Recent Awards' : 'Achievement Ribbons'}
            </h3>
            <div className={styles.stats}>
              <span className={styles.totalCount}>{totalAwards} Total</span>
              {newAwards.length > 0 && (
                <span className={styles.newCount}>{newAwards.length} New!</span>
              )}
            </div>
          </div>

          {/* Category Filter (Profile view only) */}
          {variant === 'profile' && (
            <div className={styles.categoryFilter}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`${styles.categoryButton} ${
                    activeCategory === category ? styles.active : ''
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'all' ? 'All' : 
                   category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Awards Grid */}
      <motion.div
        className={styles.awardsGrid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {displayAwards.map((award, index) => {
          const isNew = newAwards.find(newAward => newAward.id === award.id);
          
          return (
            <motion.div
              key={award.id}
              variants={ribbonVariants}
              className={styles.ribbonWrapper}
            >
              <AwardRibbon
                award={award}
                size={variant === 'compact' ? 'small' : 'medium'}
                showDetails={variant !== 'compact'}
                isNew={showNewBadges && !!isNew}
                onClick={() => handleAwardClick(award)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Show More Button */}
      {variant === 'dashboard' && awards.length > maxVisible && (
        <div className={styles.showMore}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => setShowAllAwards(true)}
          >
            View All {totalAwards} Awards
          </Button>
        </div>
      )}

      {/* Award Detail Modal */}
      <AnimatePresence>
        {selectedAward && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedAward(null)}
            className={styles.awardModal}
          >
            <div className={styles.modalContent}>
              <div className={styles.modalRibbon}>
                <AwardRibbon
                  award={selectedAward}
                  size="large"
                  showDetails={true}
                  isNew={false}
                />
              </div>
              
              <div className={styles.modalDetails}>
                <h2 className={styles.modalTitle}>{selectedAward.title}</h2>
                <p className={styles.modalDescription}>{selectedAward.description}</p>
                
                <div className={styles.modalStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Category:</span>
                    <span className={styles.statValue}>
                      {selectedAward.category?.charAt(0).toUpperCase() + 
                       selectedAward.category?.slice(1)}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Earned:</span>
                    <span className={styles.statValue}>
                      {new Date(selectedAward.earnedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <Button
                    variant="primary"
                    onClick={() => setSelectedAward(null)}
                  >
                    Continue Journey 🌸
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* All Awards Modal */}
      <AnimatePresence>
        {showAllAwards && (
          <Modal
            isOpen={true}
            onClose={() => setShowAllAwards(false)}
            className={styles.allAwardsModal}
            size="large"
          >
            <div className={styles.allAwardsContent}>
              <h2 className={styles.allAwardsTitle}>All Achievement Ribbons</h2>
              
              <motion.div
                className={styles.allAwardsGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {awards.map((award) => (
                  <motion.div
                    key={award.id}
                    variants={ribbonVariants}
                    className={styles.ribbonWrapper}
                  >
                    <AwardRibbon
                      award={award}
                      size="medium"
                      showDetails={true}
                      isNew={false}
                      onClick={() => {
                        setShowAllAwards(false);
                        setSelectedAward(award);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
              
              <div className={styles.modalActions}>
                <Button
                  variant="secondary"
                  onClick={() => setShowAllAwards(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AwardDisplay;