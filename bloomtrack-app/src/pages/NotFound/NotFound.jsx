import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import styles from './NotFound.module.css';

function NotFound() {
  const { pregnancyData } = useApp();

  // Animation variants for the page elements
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className={styles.notFound}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating decorative elements */}
      <div className={styles.decorations}>
        <motion.div className={styles.decoration} variants={floatingVariants} animate="float">🌸</motion.div>
        <motion.div className={styles.decoration} variants={floatingVariants} animate="float" style={{ animationDelay: '0.5s' }}>✨</motion.div>
        <motion.div className={styles.decoration} variants={floatingVariants} animate="float" style={{ animationDelay: '1s' }}>🌟</motion.div>
      </div>

      <motion.div className={styles.content} variants={itemVariants}>
        <motion.div 
          className={styles.icon}
          variants={itemVariants}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          🌸
        </motion.div>
        
        <motion.h1 className={styles.title} variants={itemVariants}>
          Oops! Page Not Found
        </motion.h1>
        
        <motion.p className={styles.message} variants={itemVariants}>
          The page you're looking for seems to have wandered off during your beautiful journey. 
          {pregnancyData.currentWeek > 0 && (
            <> At {pregnancyData.currentWeek} weeks, let's keep you on track!</>
          )}
        </motion.p>

        <motion.div className={styles.actions} variants={itemVariants}>
          <Link to="/" className={styles.primaryButton}>
            🏠 Back to Dashboard
          </Link>
          <Link to="/milestones" className={styles.secondaryButton}>
            🎯 View Milestones
          </Link>
          <Link to="/journal" className={styles.secondaryButton}>
            📝 My Journal
          </Link>
        </motion.div>

        <motion.div className={styles.tip} variants={itemVariants}>
          <p>
            💡 <strong>Pregnancy Tip:</strong> Use the navigation menu to explore all the amazing features 
            BloomTrack has to offer for your pregnancy journey! Track your progress, celebrate milestones, 
            and connect with your care team.
          </p>
        </motion.div>

        {pregnancyData.currentWeek > 0 && (
          <motion.div className={styles.pregnancyInfo} variants={itemVariants}>
            <div className={styles.weekBadge}>
              Week {pregnancyData.currentWeek}
            </div>
            <p>You're doing amazing! Keep tracking your journey.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default NotFound;