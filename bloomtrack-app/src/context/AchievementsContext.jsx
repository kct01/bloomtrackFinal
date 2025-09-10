import { createContext, useContext, useReducer, useEffect } from 'react';
import { RIBBON_TYPES } from '../components/common/AwardRibbon';

// Create the context
const AchievementsContext = createContext();

// Initial state for achievements
const initialState = {
  // Earned awards (ribbons)
  awards: [],
  
  // Earned trophies
  trophies: [],
  
  // Achievement tracking data
  stats: {
    totalJournalEntries: 0,
    totalJournalWords: 0,
    journalStreak: 0,
    lastJournalDate: null,
    longestJournalStreak: 0,
    totalMilestones: 0,
    milestonesWithPhotos: 0,
    moodTrackedDays: 0,
    moodStreak: 0,
    lastMoodDate: null,
    appUsageDays: 0,
    firstUsageDate: null,
    trimesterMilestones: {
      first: 0,
      second: 0,
      third: 0
    }
  },
  
  // New awards that haven't been shown yet
  newAwards: [],
  
  // New trophies that haven't been shown yet
  newTrophies: [],
  
  // Achievement check timestamps
  lastChecked: null
};

// Action types
const ACTION_TYPES = {
  ADD_AWARD: 'ADD_AWARD',
  ADD_TROPHY: 'ADD_TROPHY',
  MARK_AWARD_AS_SEEN: 'MARK_AWARD_AS_SEEN',
  MARK_TROPHY_AS_SEEN: 'MARK_TROPHY_AS_SEEN',
  UPDATE_STATS: 'UPDATE_STATS',
  INCREMENT_JOURNAL_ENTRY: 'INCREMENT_JOURNAL_ENTRY',
  ADD_JOURNAL_WORDS: 'ADD_JOURNAL_WORDS',
  INCREMENT_MILESTONE: 'INCREMENT_MILESTONE',
  INCREMENT_MILESTONE_WITH_PHOTO: 'INCREMENT_MILESTONE_WITH_PHOTO',
  UPDATE_MOOD_TRACKING: 'UPDATE_MOOD_TRACKING',
  UPDATE_JOURNAL_STREAK: 'UPDATE_JOURNAL_STREAK',
  UPDATE_MOOD_STREAK: 'UPDATE_MOOD_STREAK',
  RESET_ACHIEVEMENTS: 'RESET_ACHIEVEMENTS',
  LOAD_ACHIEVEMENTS: 'LOAD_ACHIEVEMENTS'
};

// Reducer function
function achievementsReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_AWARD:
      return {
        ...state,
        awards: [...state.awards, action.payload],
        newAwards: [...state.newAwards, action.payload]
      };
      
    case ACTION_TYPES.ADD_TROPHY:
      return {
        ...state,
        trophies: [...state.trophies, action.payload],
        newTrophies: [...state.newTrophies, action.payload]
      };
      
    case ACTION_TYPES.MARK_AWARD_AS_SEEN:
      return {
        ...state,
        newAwards: state.newAwards.filter(award => award.id !== action.payload)
      };
      
    case ACTION_TYPES.MARK_TROPHY_AS_SEEN:
      return {
        ...state,
        newTrophies: state.newTrophies.filter(trophy => trophy.id !== action.payload)
      };
      
    case ACTION_TYPES.UPDATE_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
      
    case ACTION_TYPES.INCREMENT_JOURNAL_ENTRY:
      return {
        ...state,
        stats: {
          ...state.stats,
          totalJournalEntries: state.stats.totalJournalEntries + 1
        }
      };
      
    case ACTION_TYPES.ADD_JOURNAL_WORDS:
      return {
        ...state,
        stats: {
          ...state.stats,
          totalJournalWords: state.stats.totalJournalWords + action.payload
        }
      };
      
    case ACTION_TYPES.INCREMENT_MILESTONE:
      return {
        ...state,
        stats: {
          ...state.stats,
          totalMilestones: state.stats.totalMilestones + 1
        }
      };
      
    case ACTION_TYPES.INCREMENT_MILESTONE_WITH_PHOTO:
      return {
        ...state,
        stats: {
          ...state.stats,
          milestonesWithPhotos: state.stats.milestonesWithPhotos + 1
        }
      };
      
    case ACTION_TYPES.UPDATE_JOURNAL_STREAK:
      return {
        ...state,
        stats: {
          ...state.stats,
          journalStreak: action.payload.streak,
          lastJournalDate: action.payload.date,
          longestJournalStreak: Math.max(state.stats.longestJournalStreak, action.payload.streak)
        }
      };
      
    case ACTION_TYPES.UPDATE_MOOD_STREAK:
      return {
        ...state,
        stats: {
          ...state.stats,
          moodStreak: action.payload.streak,
          lastMoodDate: action.payload.date,
          moodTrackedDays: state.stats.moodTrackedDays + 1
        }
      };
      
    case ACTION_TYPES.LOAD_ACHIEVEMENTS:
      return {
        ...state,
        ...action.payload
      };
      
    case ACTION_TYPES.RESET_ACHIEVEMENTS:
      return initialState;
      
    default:
      return state;
  }
}

// Trophy definitions
const TROPHY_TYPES = {
  RUBY_TROPHY: {
    id: 'ruby_trophy',
    title: 'Ruby Achiever',
    description: 'Earned 10 ribbons',
    icon: '🏆',
    color: 'ruby',
    requiredRibbons: 10
  },
  EMERALD_TROPHY: {
    id: 'emerald_trophy',
    title: 'Emerald Champion',
    description: 'Earned 25 ribbons',
    icon: '🏆',
    color: 'emerald',
    requiredRibbons: 25
  },
  GOLD_TROPHY: {
    id: 'gold_trophy',
    title: 'Golden Master',
    description: 'Earned 50 ribbons',
    icon: '🏆',
    color: 'gold',
    requiredRibbons: 50
  },
  DIAMOND_TROPHY: {
    id: 'diamond_trophy',
    title: 'Diamond Legend',
    description: 'Earned 100 ribbons',
    icon: '🏆',
    color: 'diamond',
    requiredRibbons: 100
  }
};

// Additional ribbon types for word count milestones
const WORD_COUNT_RIBBONS = {
  WORD_COUNT_100: {
    id: 'word_count_100',
    title: 'Wordsmith Novice',
    description: 'Wrote 100 words in journal entries',
    icon: '📝',
    color: 'bronze',
    category: 'journaling'
  },
  WORD_COUNT_500: {
    id: 'word_count_500',
    title: 'Expressive Writer',
    description: 'Wrote 500 words in journal entries',
    icon: '✍️',
    color: 'silver',
    category: 'journaling'
  },
  WORD_COUNT_1000: {
    id: 'word_count_1000',
    title: 'Journaling Enthusiast',
    description: 'Wrote 1,000 words in journal entries',
    icon: '📚',
    color: 'gold',
    category: 'journaling'
  },
  WORD_COUNT_5000: {
    id: 'word_count_5000',
    title: 'Pregnancy Chronicler',
    description: 'Wrote 5,000 words in journal entries',
    icon: '📖',
    color: 'platinum',
    category: 'journaling'
  }
};

// Helper functions for achievement checking
const checkForNewAchievements = (stats, currentAwards) => {
  const newAchievements = [];
  const earnedTypes = new Set(currentAwards.map(award => award.type));

  // Journal Achievements
  if (stats.totalJournalEntries >= 1 && !earnedTypes.has('first_journal')) {
    newAchievements.push({
      id: `award_${Date.now()}_first_journal`,
      type: 'first_journal',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.FIRST_JOURNAL
    });
  }

  if (stats.journalStreak >= 7 && !earnedTypes.has('journal_streak_7')) {
    newAchievements.push({
      id: `award_${Date.now()}_journal_streak_7`,
      type: 'journal_streak_7',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.JOURNAL_STREAK_7
    });
  }

  if (stats.journalStreak >= 30 && !earnedTypes.has('journal_streak_30')) {
    newAchievements.push({
      id: `award_${Date.now()}_journal_streak_30`,
      type: 'journal_streak_30',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.JOURNAL_STREAK_30
    });
  }

  if (stats.totalJournalEntries >= 50 && !earnedTypes.has('journal_total_50')) {
    newAchievements.push({
      id: `award_${Date.now()}_journal_total_50`,
      type: 'journal_total_50',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.JOURNAL_TOTAL_50
    });
  }

  // Word Count Achievements
  if (stats.totalJournalWords >= 100 && !earnedTypes.has('word_count_100')) {
    newAchievements.push({
      id: `award_${Date.now()}_word_count_100`,
      type: 'word_count_100',
      earnedAt: new Date().toISOString(),
      ...WORD_COUNT_RIBBONS.WORD_COUNT_100
    });
  }

  if (stats.totalJournalWords >= 500 && !earnedTypes.has('word_count_500')) {
    newAchievements.push({
      id: `award_${Date.now()}_word_count_500`,
      type: 'word_count_500',
      earnedAt: new Date().toISOString(),
      ...WORD_COUNT_RIBBONS.WORD_COUNT_500
    });
  }

  if (stats.totalJournalWords >= 1000 && !earnedTypes.has('word_count_1000')) {
    newAchievements.push({
      id: `award_${Date.now()}_word_count_1000`,
      type: 'word_count_1000',
      earnedAt: new Date().toISOString(),
      ...WORD_COUNT_RIBBONS.WORD_COUNT_1000
    });
  }

  if (stats.totalJournalWords >= 5000 && !earnedTypes.has('word_count_5000')) {
    newAchievements.push({
      id: `award_${Date.now()}_word_count_5000`,
      type: 'word_count_5000',
      earnedAt: new Date().toISOString(),
      ...WORD_COUNT_RIBBONS.WORD_COUNT_5000
    });
  }

  // Milestone Achievements
  if (stats.totalMilestones >= 1 && !earnedTypes.has('first_milestone')) {
    newAchievements.push({
      id: `award_${Date.now()}_first_milestone`,
      type: 'first_milestone',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.FIRST_MILESTONE
    });
  }

  if (stats.milestonesWithPhotos >= 5 && !earnedTypes.has('milestone_photographer')) {
    newAchievements.push({
      id: `award_${Date.now()}_milestone_photographer`,
      type: 'milestone_photographer',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.MILESTONE_PHOTOGRAPHER
    });
  }

  if (stats.totalMilestones >= 10 && !earnedTypes.has('milestone_achiever')) {
    newAchievements.push({
      id: `award_${Date.now()}_milestone_achiever`,
      type: 'milestone_achiever',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.MILESTONE_ACHIEVER
    });
  }

  // Special Achievements
  if (stats.appUsageDays >= 7 && !earnedTypes.has('first_week')) {
    newAchievements.push({
      id: `award_${Date.now()}_first_week`,
      type: 'first_week',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.FIRST_WEEK
    });
  }

  if (stats.moodStreak >= 14 && !earnedTypes.has('mood_tracker')) {
    newAchievements.push({
      id: `award_${Date.now()}_mood_tracker`,
      type: 'mood_tracker',
      earnedAt: new Date().toISOString(),
      ...RIBBON_TYPES.MOOD_TRACKER
    });
  }

  return newAchievements;
};

// Helper function for trophy checking
const checkForNewTrophies = (totalRibbons, currentTrophies) => {
  const newTrophies = [];
  const earnedTrophyTypes = new Set(currentTrophies.map(trophy => trophy.type));

  // Check each trophy level
  Object.values(TROPHY_TYPES).forEach(trophyType => {
    if (totalRibbons >= trophyType.requiredRibbons && !earnedTrophyTypes.has(trophyType.id)) {
      newTrophies.push({
        id: `trophy_${Date.now()}_${trophyType.id}`,
        type: trophyType.id,
        earnedAt: new Date().toISOString(),
        ribbonsRequired: trophyType.requiredRibbons,
        ...trophyType
      });
    }
  });

  return newTrophies;
};

// Calculate journal streak
const calculateJournalStreak = (lastDate, currentDate) => {
  if (!lastDate) return 1;
  
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  const diffTime = Math.abs(current - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If it's the same day, don't increment
  if (diffDays === 0) return 0;
  // If it's the next day, increment streak
  if (diffDays === 1) return 1;
  // If more than 1 day gap, reset streak
  return -1; // Signal to reset
};

// Local storage keys
const STORAGE_KEY = 'bloomtrack_achievements';

// AchievementsProvider component
export function AchievementsProvider({ children }) {
  const [state, dispatch] = useReducer(achievementsReducer, initialState);

  // Load achievements from localStorage on mount
  useEffect(() => {
    loadAchievements();
  }, []);

  // Save achievements to localStorage whenever state changes
  useEffect(() => {
    saveAchievements();
  }, [state]);

  // Load achievements from storage
  const loadAchievements = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        dispatch({ type: ACTION_TYPES.LOAD_ACHIEVEMENTS, payload: data });
      } else {
        // Initialize first usage date if not set
        const now = new Date().toISOString();
        dispatch({ 
          type: ACTION_TYPES.UPDATE_STATS, 
          payload: { 
            firstUsageDate: now,
            appUsageDays: 1
          }
        });
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  // Save achievements to storage
  const saveAchievements = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

  // Action creators
  const actions = {
    // Journal tracking
    trackJournalEntry: (wordCount = 0) => {
      const today = new Date().toISOString().split('T')[0];
      const streakChange = calculateJournalStreak(state.stats.lastJournalDate, today);
      
      dispatch({ type: ACTION_TYPES.INCREMENT_JOURNAL_ENTRY });
      
      // Add word count if provided
      if (wordCount > 0) {
        dispatch({ type: ACTION_TYPES.ADD_JOURNAL_WORDS, payload: wordCount });
      }
      
      if (streakChange === 1) {
        // Continue streak
        dispatch({ 
          type: ACTION_TYPES.UPDATE_JOURNAL_STREAK, 
          payload: { 
            streak: state.stats.journalStreak + 1, 
            date: today 
          }
        });
      } else if (streakChange === -1) {
        // Reset streak
        dispatch({ 
          type: ACTION_TYPES.UPDATE_JOURNAL_STREAK, 
          payload: { 
            streak: 1, 
            date: today 
          }
        });
      }
      // streakChange === 0 means same day, no change
      
      // Check for new achievements and trophies
      setTimeout(() => {
        checkAchievements();
        checkTrophies();
      }, 100);
    },

    // Milestone tracking
    trackMilestone: (hasPhoto = false) => {
      dispatch({ type: ACTION_TYPES.INCREMENT_MILESTONE });
      if (hasPhoto) {
        dispatch({ type: ACTION_TYPES.INCREMENT_MILESTONE_WITH_PHOTO });
      }
      
      // Check for new achievements and trophies
      setTimeout(() => {
        checkAchievements();
        checkTrophies();
      }, 100);
    },

    // Mood tracking
    trackMoodEntry: () => {
      const today = new Date().toISOString().split('T')[0];
      const streakChange = calculateJournalStreak(state.stats.lastMoodDate, today);
      
      if (streakChange === 1) {
        // Continue streak
        dispatch({ 
          type: ACTION_TYPES.UPDATE_MOOD_STREAK, 
          payload: { 
            streak: state.stats.moodStreak + 1, 
            date: today 
          }
        });
      } else if (streakChange === -1) {
        // Reset streak
        dispatch({ 
          type: ACTION_TYPES.UPDATE_MOOD_STREAK, 
          payload: { 
            streak: 1, 
            date: today 
          }
        });
      }
      
      // Check for new achievements and trophies
      setTimeout(() => {
        checkAchievements();
        checkTrophies();
      }, 100);
    },

    // Mark award as seen
    markAwardAsSeen: (awardId) => {
      dispatch({ type: ACTION_TYPES.MARK_AWARD_AS_SEEN, payload: awardId });
    },

    // Mark trophy as seen
    markTrophyAsSeen: (trophyId) => {
      dispatch({ type: ACTION_TYPES.MARK_TROPHY_AS_SEEN, payload: trophyId });
    },

    // Manual achievement check
    checkAchievements: () => {
      const newAchievements = checkForNewAchievements(state.stats, state.awards);
      newAchievements.forEach(achievement => {
        dispatch({ type: ACTION_TYPES.ADD_AWARD, payload: achievement });
      });
      return newAchievements;
    },

    // Manual trophy check
    checkTrophies: () => {
      const newTrophies = checkForNewTrophies(state.awards.length, state.trophies);
      newTrophies.forEach(trophy => {
        dispatch({ type: ACTION_TYPES.ADD_TROPHY, payload: trophy });
      });
      return newTrophies;
    },

    // Get awards by category
    getAwardsByCategory: (category) => {
      return state.awards.filter(award => award.category === category);
    },

    // Get recent awards
    getRecentAwards: (limit = 5) => {
      return state.awards
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, limit);
    },

    // Reset all achievements (for testing)
    resetAchievements: () => {
      dispatch({ type: ACTION_TYPES.RESET_ACHIEVEMENTS });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Check for achievements function
  const checkAchievements = () => {
    return actions.checkAchievements();
  };

  // Check for trophies function
  const checkTrophies = () => {
    return actions.checkTrophies();
  };

  // Context value
  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    totalAwards: state.awards.length,
    totalTrophies: state.trophies.length,
    hasNewAwards: state.newAwards.length > 0,
    hasNewTrophies: state.newTrophies.length > 0,
    
    // Achievement progress
    progressToNextJournalAward: Math.min(100, (state.stats.totalJournalEntries / 50) * 100),
    progressToNextMilestoneAward: Math.min(100, (state.stats.totalMilestones / 10) * 100),
    progressToNextWordAward: Math.min(100, ((state.stats.totalJournalWords % 100) / 100) * 100),
    
    // Trophy progress
    progressToNextTrophy: (() => {
      const ribbonCount = state.awards.length;
      const nextTrophyLevels = [10, 25, 50, 100];
      const nextLevel = nextTrophyLevels.find(level => ribbonCount < level);
      if (!nextLevel) return 100;
      const prevLevel = nextTrophyLevels[nextTrophyLevels.indexOf(nextLevel) - 1] || 0;
      return ((ribbonCount - prevLevel) / (nextLevel - prevLevel)) * 100;
    })(),
    
    ribbonsToNextTrophy: (() => {
      const ribbonCount = state.awards.length;
      const nextTrophyLevels = [10, 25, 50, 100];
      const nextLevel = nextTrophyLevels.find(level => ribbonCount < level);
      return nextLevel ? nextLevel - ribbonCount : 0;
    })()
  };

  return (
    <AchievementsContext.Provider value={contextValue}>
      {children}
    </AchievementsContext.Provider>
  );
}

// Custom hook to use achievements context
export function useAchievements() {
  const context = useContext(AchievementsContext);
  
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  
  return context;
}

export { ACTION_TYPES, TROPHY_TYPES, WORD_COUNT_RIBBONS };