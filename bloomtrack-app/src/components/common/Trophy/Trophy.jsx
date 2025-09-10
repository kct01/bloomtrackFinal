import React from 'react';
import { motion } from 'framer-motion';
import styles from './Trophy.module.css';

const Trophy = ({ 
  trophy, 
  size = 'large', 
  showDetails = true, 
  isNew = false,
  onClick,
  className = ''
}) => {
  const trophyVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      rotateY: -180 
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    },
    hover: { 
      scale: 1.1,
      rotateY: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const glowVariants = {
    pulse: {
      boxShadow: [
        '0 0 20px rgba(255, 215, 0, 0.3)',
        '0 0 40px rgba(255, 215, 0, 0.6)',
        '0 0 20px rgba(255, 215, 0, 0.3)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const newBadgeVariants = {
    bounce: {
      y: [-10, 0, -10],
      rotate: [-5, 5, -5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const sparkleVariants = {
    sparkle: {
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2
      }
    }
  };

  const getTrophyIcon = (color) => {
    switch (color) {
      case 'ruby': return '🔴';
      case 'emerald': return '🟢';
      case 'gold': return '🟡';
      case 'diamond': return '💎';
      default: return '🏆';
    }
  };

  return (
    <motion.div
      className={`${styles.trophyContainer} ${styles[size]} ${styles[trophy.color]} ${className}`}
      variants={trophyVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${trophy.title} trophy: ${trophy.description}`}
    >
      {/* New Badge */}
      {isNew && (
        <motion.div 
          className={styles.newBadge}
          variants={newBadgeVariants}
          animate="bounce"
        >
          NEW TROPHY!
        </motion.div>
      )}

      {/* Trophy Base */}
      <motion.div 
        className={styles.trophyBase}
        variants={glowVariants}
        animate="pulse"
      >
        {/* Trophy Cup */}
        <div className={styles.trophyCup}>
          {/* Trophy Icon */}
          <div className={styles.trophyIcon}>
            <span role="img" aria-hidden="true">
              {getTrophyIcon(trophy.color)}
            </span>
            <span className={styles.mainTrophy} role="img" aria-hidden="true">
              {trophy.icon}
            </span>
          </div>
          
          {/* Trophy Handles */}
          <div className={styles.trophyHandles}>
            <div className={styles.trophyHandle}></div>
            <div className={styles.trophyHandle}></div>
          </div>
        </div>

        {/* Trophy Stem */}
        <div className={styles.trophyStem}></div>

        {/* Trophy Platform */}
        <div className={styles.trophyPlatform}>
          {showDetails && (
            <div className={styles.trophyLabel}>
              <h3 className={styles.trophyTitle}>{trophy.title}</h3>
              <p className={styles.ribbonCount}>
                {trophy.ribbonsRequired} ribbons
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trophy Details */}
      {showDetails && (
        <div className={styles.trophyDetails}>
          <p className={styles.trophyDescription}>{trophy.description}</p>
          {trophy.earnedAt && (
            <div className={styles.earnedDate}>
              Earned {new Date(trophy.earnedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      )}

      {/* Sparkle Effects */}
      <div className={styles.sparkles}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`${styles.sparkle} ${styles[`sparkle${i + 1}`]}`}
            variants={sparkleVariants}
            animate="sparkle"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Victory Rays */}
      <div className={styles.victoryRays}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={styles.ray}
            style={{ transform: `rotate(${i * 45}deg)` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Trophy;