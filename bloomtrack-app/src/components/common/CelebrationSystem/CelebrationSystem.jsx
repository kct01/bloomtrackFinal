import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { usePregnancy } from '../../../context/PregnancyContext';
import Modal from '../Modal';
import Button from '../Button';
import styles from './CelebrationSystem.module.css';

const CELEBRATION_TRIGGERS = {
  WEEK_MILESTONE: 'week_milestone',
  TRIMESTER_CHANGE: 'trimester_change',
  VIABILITY: 'viability',
  FULL_TERM: 'full_term',
  DUE_DATE_APPROACHING: 'due_date_approaching'
};

const CELEBRATIONS = {
  [CELEBRATION_TRIGGERS.WEEK_MILESTONE]: {
    12: {
      title: "End of First Trimester! 🎉",
      message: "You've made it through the first trimester! Many of the early pregnancy symptoms may start to ease.",
      icon: "🌸",
      color: "pink",
      confetti: true
    },
    20: {
      title: "Halfway There! 🎯",
      message: "You're halfway through your pregnancy journey! Time for that anatomy scan!",
      icon: "🎊",
      color: "peach",
      confetti: true
    },
    24: {
      title: "Viability Milestone! ✨",
      message: "Your baby has reached the viability milestone! This is a major pregnancy achievement.",
      icon: "💪",
      color: "green",
      confetti: true
    },
    28: {
      title: "Welcome to Third Trimester! 🌟",
      message: "You've entered the final stretch! Your baby is growing rapidly now.",
      icon: "👶",
      color: "blue",
      confetti: true
    },
    36: {
      title: "Full Term Approaching! 🎈",
      message: "Almost there! Your baby is nearly ready to meet you.",
      icon: "🎁",
      color: "lavender",
      confetti: true
    },
    37: {
      title: "Full Term! 🎊",
      message: "Congratulations! Your baby is now considered full term and ready to be born safely.",
      icon: "✨",
      color: "gold",
      confetti: true
    }
  },
  
  [CELEBRATION_TRIGGERS.TRIMESTER_CHANGE]: {
    2: {
      title: "Second Trimester Energy! 💚",
      message: "Welcome to the 'golden period' of pregnancy! Many women feel their best during this time.",
      icon: "🌻",
      color: "green",
      confetti: false
    },
    3: {
      title: "Final Trimester! 💙",
      message: "The home stretch! Your little one is getting ready to meet you.",
      icon: "🏠",
      color: "blue",
      confetti: false
    }
  }
};

function CelebrationSystem() {
  const { pregnancyData } = useApp();
  const { isFullTerm } = usePregnancy();
  const [activeCelebration, setActiveCelebration] = useState(null);
  const [shownCelebrations, setShownCelebrations] = useState(new Set());

  // Check for celebrations when pregnancy data changes
  useEffect(() => {
    checkForCelebrations();
  }, [pregnancyData.currentWeek, pregnancyData.trimester]);

  const checkForCelebrations = () => {
    const currentWeek = pregnancyData.currentWeek;
    const trimester = pregnancyData.trimester;

    // Check week milestones
    const weekCelebration = CELEBRATIONS[CELEBRATION_TRIGGERS.WEEK_MILESTONE][currentWeek];
    if (weekCelebration && !shownCelebrations.has(`week_${currentWeek}`)) {
      triggerCelebration({
        ...weekCelebration,
        id: `week_${currentWeek}`,
        type: CELEBRATION_TRIGGERS.WEEK_MILESTONE
      });
      return;
    }

    // Check trimester changes (only show once per trimester)
    const trimesterCelebration = CELEBRATIONS[CELEBRATION_TRIGGERS.TRIMESTER_CHANGE][trimester];
    if (trimesterCelebration && !shownCelebrations.has(`trimester_${trimester}`)) {
      // Only show if we're actually starting the trimester (not just loading into it)
      const expectedWeekForTrimester = trimester === 2 ? 13 : trimester === 3 ? 28 : 1;
      if (currentWeek >= expectedWeekForTrimester && currentWeek <= expectedWeekForTrimester + 1) {
        triggerCelebration({
          ...trimesterCelebration,
          id: `trimester_${trimester}`,
          type: CELEBRATION_TRIGGERS.TRIMESTER_CHANGE
        });
        return;
      }
    }
  };

  const triggerCelebration = (celebration) => {
    setActiveCelebration(celebration);
    
    // Add to shown celebrations
    setShownCelebrations(prev => new Set([...prev, celebration.id]));
    
    // Store in localStorage to persist across sessions
    const stored = JSON.parse(localStorage.getItem('bloomtrack_celebrations') || '[]');
    stored.push(celebration.id);
    localStorage.setItem('bloomtrack_celebrations', JSON.stringify(stored));
    
    // Trigger confetti if specified
    if (celebration.confetti) {
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    // Create confetti effect
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create confetti particles
      for (let i = 0; i < particleCount; i++) {
        createConfettiParticle({
          ...defaults,
          particleCount: 1,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        createConfettiParticle({
          ...defaults,
          particleCount: 1,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }
    }, 250);
  };

  const createConfettiParticle = ({ particleCount, origin }) => {
    // Simple confetti particle creation
    const particle = document.createElement('div');
    particle.className = styles.confettiParticle;
    particle.style.left = `${origin.x * 100}%`;
    particle.style.top = `${origin.y * 100 + 50}%`;
    particle.style.background = `hsl(${Math.random() * 360}, 70%, 70%)`;
    
    document.body.appendChild(particle);
    
    // Animate and remove
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 3000);
  };

  const closeCelebration = () => {
    setActiveCelebration(null);
  };

  // Initialize shown celebrations from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('bloomtrack_celebrations') || '[]');
    setShownCelebrations(new Set(stored));
  }, []);

  if (!activeCelebration) {
    return null;
  }

  return (
    <Modal isOpen={true} onClose={closeCelebration} className={styles.celebrationModal}>
      <div className={`${styles.celebrationContent} ${styles[activeCelebration.color]}`}>
        {/* Celebration Header */}
        <div className={styles.celebrationHeader}>
          <div className={styles.celebrationIcon}>
            {activeCelebration.icon}
          </div>
          <h2 className={styles.celebrationTitle}>
            {activeCelebration.title}
          </h2>
        </div>

        {/* Celebration Message */}
        <div className={styles.celebrationMessage}>
          <p>{activeCelebration.message}</p>
        </div>

        {/* Celebration Actions */}
        <div className={styles.celebrationActions}>
          <Button 
            variant="celebration" 
            onClick={closeCelebration}
            className={styles.celebrationButton}
          >
            Continue Journey! 🌸
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className={styles.celebrationDecorations}>
          <div className={styles.decoration}>✨</div>
          <div className={styles.decoration}>🌟</div>
          <div className={styles.decoration}>💫</div>
          <div className={styles.decoration}>⭐</div>
        </div>
      </div>
    </Modal>
  );
}

export default CelebrationSystem;