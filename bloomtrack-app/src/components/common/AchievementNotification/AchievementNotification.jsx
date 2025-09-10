import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievements } from '../../../context/AchievementsContext';
import AwardRibbon from '../AwardRibbon';
import Trophy from '../Trophy';
import styles from './AchievementNotification.module.css';

const AchievementNotification = () => {
  const { 
    newAwards, 
    newTrophies, 
    markAwardAsSeen, 
    markTrophyAsSeen 
  } = useAchievements();
  
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationQueue, setNotificationQueue] = useState([]);

  // Process new achievements and trophies
  useEffect(() => {
    const newNotifications = [];
    
    // Add new awards to queue
    newAwards.forEach(award => {
      newNotifications.push({
        type: 'award',
        data: award,
        id: `award_${award.id}`
      });
    });
    
    // Add new trophies to queue
    newTrophies.forEach(trophy => {
      newNotifications.push({
        type: 'trophy',
        data: trophy,
        id: `trophy_${trophy.id}`
      });
    });
    
    if (newNotifications.length > 0) {
      setNotificationQueue(prev => [...prev, ...newNotifications]);
    }
  }, [newAwards, newTrophies]);

  // Show notifications one by one
  useEffect(() => {
    if (!currentNotification && notificationQueue.length > 0) {
      const [nextNotification, ...remainingQueue] = notificationQueue;
      setCurrentNotification(nextNotification);
      setNotificationQueue(remainingQueue);
    }
  }, [currentNotification, notificationQueue]);

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (currentNotification) {
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentNotification]);

  const handleClose = () => {
    if (currentNotification) {
      // Mark as seen
      if (currentNotification.type === 'award') {
        markAwardAsSeen(currentNotification.data.id);
      } else if (currentNotification.type === 'trophy') {
        markTrophyAsSeen(currentNotification.data.id);
      }
      
      setCurrentNotification(null);
    }
  };

  const notificationVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      x: 100,
      y: -50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      x: 100,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const celebrationVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: [0, 1.2, 1],
      transition: {
        duration: 0.8,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  };

  if (!currentNotification) return null;

  const { type, data } = currentNotification;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.notificationOverlay}
        variants={notificationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className={styles.notificationContainer}>
          {/* Close Button */}
          <button 
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close notification"
          >
            ×
          </button>

          {/* Celebration Effects */}
          <div className={styles.celebrationEffects}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`${styles.confetti} ${styles[`confetti${i + 1}`]}`}
                variants={celebrationVariants}
                initial="hidden"
                animate="visible"
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              >
                🎉
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className={styles.notificationContent}>
            <motion.div 
              className={styles.achievementHeader}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className={styles.congratsTitle}>
                {type === 'trophy' ? '🏆 New Trophy Earned!' : '🎉 Achievement Unlocked!'}
              </h2>
              <p className={styles.congratsSubtitle}>
                {type === 'trophy' 
                  ? 'You\'ve earned a beautiful new trophy!' 
                  : 'You\'ve earned a new ribbon for your journey!'
                }
              </p>
            </motion.div>

            <motion.div 
              className={styles.achievementDisplay}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {type === 'trophy' ? (
                <Trophy
                  trophy={data}
                  size="large"
                  showDetails={true}
                  isNew={true}
                />
              ) : (
                <AwardRibbon
                  award={data}
                  size="large"
                  showDetails={true}
                  isNew={true}
                />
              )}
            </motion.div>

            <motion.div 
              className={styles.achievementDetails}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className={styles.achievementTitle}>{data.title}</h3>
              <p className={styles.achievementDescription}>{data.description}</p>
              
              {type === 'trophy' && data.ribbonsRequired && (
                <p className={styles.trophyRequirement}>
                  Earned by collecting {data.ribbonsRequired} ribbons
                </p>
              )}
            </motion.div>

            <motion.div 
              className={styles.notificationActions}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <button 
                className={styles.continueButton}
                onClick={handleClose}
              >
                Continue Journey
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AchievementNotification;