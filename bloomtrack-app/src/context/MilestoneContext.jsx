import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useApp } from './AppContext';

// Create the context
const MilestoneContext = createContext();

// Initial state
const initialState = {
  // Milestone tracking
  milestones: {
    preset: [], // Default pregnancy milestones
    custom: [], // User-created milestones
    achieved: [], // Completed milestones with photos/notes
    upcoming: [] // Next milestones to achieve
  },

  // Photo memories
  memories: {
    photos: [], // Milestone photos with metadata
    videos: [], // Video memories
    notes: [], // Text memories and reflections
    timeline: [] // Chronological memory timeline
  },

  // Celebration settings
  celebrations: {
    enableAnimations: true,
    enableNotifications: true,
    autoDetectMilestones: true,
    shareWithPartner: false,
    celebrationStyle: 'gentle' // gentle, festive, minimal
  },

  // Sharing and community
  sharing: {
    publicMilestones: [], // Milestones shared with community
    privateMilestones: [], // Personal milestones only
    sharedMemories: [], // Photos/notes shared with care team
    celebrationMessages: [] // Messages from family/friends
  },

  // Progress tracking
  progress: {
    totalMilestones: 0,
    achievedCount: 0,
    upcomingCount: 0,
    completionPercentage: 0,
    streakDays: 0
  }
};

// Default pregnancy milestones with rich data
const DEFAULT_MILESTONES = [
  {
    id: 'positive-test',
    title: 'First Positive Test',
    description: 'The moment you found out you\'re pregnant!',
    category: 'discovery',
    week: 4,
    trimester: 1,
    icon: '🤰',
    color: '#F4A6CD',
    celebrationMessage: 'Congratulations! Your journey begins! 💕',
    tips: ['Take a photo of the test', 'Start prenatal vitamins', 'Call your doctor'],
    isAutoDetectable: false,
    importance: 'high'
  },
  {
    id: 'milestone-first-appointment',
    title: 'First Prenatal Appointment',
    description: 'Your first official doctor visit',
    category: 'medical',
    week: 8,
    trimester: 1,
    icon: '👩‍⚕️',
    color: '#FFB5A7',
    celebrationMessage: 'Great job taking care of yourself and baby! 🏥',
    tips: ['Prepare questions', 'Bring partner if possible', 'Ask about nutrition'],
    isAutoDetectable: false,
    importance: 'high'
  },
  {
    id: 'milestone-first-heartbeat',
    title: 'First Heartbeat',
    description: 'Hearing baby\'s heartbeat for the first time',
    category: 'medical',
    week: 10,
    trimester: 1,
    icon: '💓',
    color: '#C8A8E9',
    celebrationMessage: 'Your baby\'s heart is beating strong! 💓',
    tips: ['Record the moment', 'Ask for a printout', 'Share with loved ones'],
    isAutoDetectable: false,
    importance: 'high'
  },
  {
    id: 'milestone-end-first-trimester',
    title: 'End of First Trimester',
    description: 'You\'ve completed the first trimester!',
    category: 'progress',
    week: 12,
    trimester: 1,
    icon: '🎉',
    color: '#A8D8A8',
    celebrationMessage: 'You\'ve made it through the first trimester! 🌟',
    tips: ['Share the news', 'Plan maternity photos', 'Start showing'],
    isAutoDetectable: true,
    importance: 'high'
  },
  {
    id: 'milestone-start-second-trimester',
    title: 'Start of Second Trimester',
    description: 'Welcome to the second trimester - the golden period!',
    category: 'progress',
    week: 13,
    trimester: 2,
    icon: '🌅',
    color: '#FFB5A7',
    celebrationMessage: 'Welcome to the golden trimester! ✨',
    tips: ['Energy should return', 'Morning sickness may ease', 'Start planning nursery'],
    isAutoDetectable: true,
    importance: 'high'
  },
  {
    id: 'milestone-gender-reveal',
    title: 'Gender Reveal',
    description: 'Finding out if it\'s a boy or girl!',
    category: 'discovery',
    week: 18,
    trimester: 2,
    icon: '👶',
    color: '#F4A6CD',
    celebrationMessage: 'What an exciting reveal! 💙💗',
    tips: ['Plan a reveal party', 'Take photos', 'Start thinking names'],
    isAutoDetectable: false,
    importance: 'medium'
  },
  {
    id: 'milestone-anatomy-scan',
    title: 'Anatomy Scan',
    description: 'Detailed ultrasound to check baby\'s development',
    category: 'medical',
    week: 20,
    trimester: 2,
    icon: '🔬',
    color: '#FFB5A7',
    celebrationMessage: 'Everything looks perfect! 👶',
    tips: ['Bring partner', 'Ask for photos', 'Ask questions'],
    isAutoDetectable: false,
    importance: 'high'
  },
  {
    id: 'milestone-first-kick',
    title: 'First Kick',
    description: 'Feeling baby move for the first time',
    category: 'movement',
    week: 18,
    trimester: 2,
    icon: '🦵',
    color: '#C8A8E9',
    celebrationMessage: 'Baby says hello! 👋',
    tips: ['Note the time', 'Tell your partner', 'Start kick counting'],
    isAutoDetectable: false,
    importance: 'high'
  },
  {
    id: 'milestone-end-second-trimester',
    title: 'End of Second Trimester',
    description: 'You\'ve completed the second trimester!',
    category: 'progress',
    week: 27,
    trimester: 2,
    icon: '🌟',
    color: '#C8A8E9',
    celebrationMessage: 'Two-thirds of the way there! 🌟',
    tips: ['Third trimester prep', 'Finalize birth plan', 'Stock up on essentials'],
    isAutoDetectable: true,
    importance: 'high'
  },
  {
    id: 'milestone-start-third-trimester',
    title: 'Start of Third Trimester',
    description: 'The final stretch - you\'re in the home stretch!',
    category: 'progress',
    week: 28,
    trimester: 3,
    icon: '🏁',
    color: '#F4A6CD',
    celebrationMessage: 'Final trimester - baby will be here soon! 🏁',
    tips: ['Prepare hospital bag', 'Finalize nursery', 'Practice breathing exercises'],
    isAutoDetectable: true,
    importance: 'high'
  },
  {
    id: 'milestone-baby-shower',
    title: 'Baby Shower',
    description: 'Celebrating with family and friends',
    category: 'celebration',
    week: 32,
    trimester: 3,
    icon: '🎁',
    color: '#A8D8A8',
    celebrationMessage: 'Surrounded by love and gifts! 🎊',
    tips: ['Take lots of photos', 'Keep a guest book', 'Thank everyone'],
    isAutoDetectable: false,
    importance: 'medium'
  },
  {
    id: 'milestone-maternity-photos',
    title: 'Maternity Photos',
    description: 'Professional photos of your beautiful bump',
    category: 'memories',
    week: 34,
    trimester: 3,
    icon: '📸',
    color: '#F4A6CD',
    celebrationMessage: 'Capturing this beautiful moment! 📷',
    tips: ['Book early', 'Choose meaningful location', 'Include partner'],
    isAutoDetectable: false,
    importance: 'medium'
  },
  {
    id: 'milestone-hospital-bag',
    title: 'Hospital Bag Packed',
    description: 'Ready for baby\'s arrival!',
    category: 'preparation',
    week: 36,
    trimester: 3,
    icon: '🎒',
    color: '#FFB5A7',
    celebrationMessage: 'You\'re prepared and ready! 👍',
    tips: ['Include comfort items', 'Pack for partner too', 'Keep car seat ready'],
    isAutoDetectable: false,
    importance: 'high'
  },
  {
    id: 'delivery',
    title: 'Baby\'s Arrival',
    description: 'The most amazing milestone - meeting your little one!',
    category: 'delivery',
    week: 40,
    trimester: 3,
    icon: '👶',
    color: '#A8D8A8',
    celebrationMessage: 'Congratulations! Your baby is here! 🎉💕',
    tips: ['Enjoy skin-to-skin contact', 'Take lots of photos', 'Rest when you can'],
    isAutoDetectable: false,
    importance: 'ultimate'
  }
];

// Action types
const MILESTONE_ACTIONS = {
  // Milestone management
  LOAD_DEFAULT_MILESTONES: 'LOAD_DEFAULT_MILESTONES',
  LOAD_DATA: 'LOAD_DATA',
  ADD_CUSTOM_MILESTONE: 'ADD_CUSTOM_MILESTONE',
  UPDATE_MILESTONE: 'UPDATE_MILESTONE',
  DELETE_MILESTONE: 'DELETE_MILESTONE',
  
  // Achievement actions
  ACHIEVE_MILESTONE: 'ACHIEVE_MILESTONE',
  UNDO_ACHIEVEMENT: 'UNDO_ACHIEVEMENT',
  ADD_MILESTONE_MEMORY: 'ADD_MILESTONE_MEMORY',
  
  // Memory management
  ADD_PHOTO: 'ADD_PHOTO',
  ADD_VIDEO: 'ADD_VIDEO',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_MEMORY: 'UPDATE_MEMORY',
  DELETE_MEMORY: 'DELETE_MEMORY',
  
  // Celebration settings
  UPDATE_CELEBRATION_SETTINGS: 'UPDATE_CELEBRATION_SETTINGS',
  TRIGGER_CELEBRATION: 'TRIGGER_CELEBRATION',
  
  // Sharing actions
  SHARE_MILESTONE: 'SHARE_MILESTONE',
  UNSHARE_MILESTONE: 'UNSHARE_MILESTONE',
  ADD_CELEBRATION_MESSAGE: 'ADD_CELEBRATION_MESSAGE',
  
  // Progress updates
  CALCULATE_PROGRESS: 'CALCULATE_PROGRESS',
  UPDATE_STREAK: 'UPDATE_STREAK'
};

// Milestone categories with styling
const MILESTONE_CATEGORIES = {
  discovery: {
    label: 'Discovery',
    icon: '🔍',
    color: '#F4A6CD',
    description: 'Finding out exciting news'
  },
  medical: {
    label: 'Medical',
    icon: '🏥',
    color: '#FFB5A7',
    description: 'Important medical milestones'
  },
  movement: {
    label: 'Movement',
    icon: '👶',
    color: '#C8A8E9',
    description: 'Baby movements and kicks'
  },
  progress: {
    label: 'Progress',
    icon: '📈',
    color: '#A8D8A8',
    description: 'Trimester and weekly progress'
  },
  celebration: {
    label: 'Celebration',
    icon: '🎉',
    color: '#FFB3BA',
    description: 'Parties and celebrations'
  },
  memories: {
    label: 'Memories',
    icon: '💕',
    color: '#E8B4B8',
    description: 'Photos and special moments'
  },
  preparation: {
    label: 'Preparation',
    icon: '📋',
    color: '#B5E7A0',
    description: 'Getting ready for baby'
  },
  custom: {
    label: 'Personal',
    icon: '⭐',
    color: '#F4A261',
    description: 'Your personal milestones'
  },
  delivery: {
    label: 'Delivery',
    icon: '👶',
    color: '#A8D8A8',
    description: 'The ultimate milestone - baby\'s arrival'
  }
};

// Reducer function
function milestoneReducer(state, action) {
  switch (action.type) {
    case MILESTONE_ACTIONS.LOAD_DEFAULT_MILESTONES:
      return {
        ...state,
        milestones: {
          ...state.milestones,
          preset: DEFAULT_MILESTONES
        }
      };

    case MILESTONE_ACTIONS.LOAD_DATA:
      console.log('LOAD_DATA reducer called with payload:', action.payload);
      return {
        ...state,
        ...action.payload
      };

    case MILESTONE_ACTIONS.ADD_CUSTOM_MILESTONE:
      const customMilestone = {
        ...action.payload,
        id: `custom-${Date.now()}`,
        category: 'custom',
        createdAt: new Date().toISOString(),
        isCustom: true
      };
      
      return {
        ...state,
        milestones: {
          ...state.milestones,
          custom: [...state.milestones.custom, customMilestone]
        }
      };

    case MILESTONE_ACTIONS.UPDATE_MILESTONE:
      const { id, updates, milestoneType } = action.payload;
      
      return {
        ...state,
        milestones: {
          ...state.milestones,
          [milestoneType]: state.milestones[milestoneType].map(milestone =>
            milestone.id === id ? { ...milestone, ...updates } : milestone
          )
        }
      };

    case MILESTONE_ACTIONS.DELETE_MILESTONE:
      const { milestoneId, type } = action.payload;
      
      return {
        ...state,
        milestones: {
          ...state.milestones,
          [type]: state.milestones[type].filter(milestone => milestone.id !== milestoneId),
          achieved: state.milestones.achieved.filter(achievement => 
            achievement.milestone?.id !== milestoneId
          )
        }
      };

    case MILESTONE_ACTIONS.ACHIEVE_MILESTONE:
      console.log('ACHIEVE_MILESTONE reducer called for:', action.payload.milestone.title);
      console.log('Current achieved milestones before adding:', state.milestones.achieved.map(m => m.title));
      
      // Check if already achieved to prevent duplicates
      const alreadyAchieved = state.milestones.achieved.find(
        achieved => achieved.id === action.payload.milestone.id
      );
      
      if (alreadyAchieved) {
        console.log('Milestone already achieved, not adding duplicate:', action.payload.milestone.title);
        return state;
      }
      
      const achievedMilestone = {
        ...action.payload.milestone,
        achievedAt: action.payload.milestone.achievedAt || new Date().toISOString(),
        photos: action.payload.photos || [],
        notes: action.payload.notes || '',
        mood: action.payload.mood || 'excellent',
        celebrationViewed: false
      };

      console.log('Adding new achievement:', achievedMilestone.title);

      return {
        ...state,
        milestones: {
          ...state.milestones,
          achieved: [...state.milestones.achieved, achievedMilestone]
        }
      };

    case MILESTONE_ACTIONS.UNDO_ACHIEVEMENT:
      return {
        ...state,
        milestones: {
          ...state.milestones,
          achieved: state.milestones.achieved.filter(
            milestone => milestone.id !== action.payload
          )
        }
      };

    case MILESTONE_ACTIONS.ADD_PHOTO:
      const photo = {
        id: `photo-${Date.now()}`,
        ...action.payload,
        uploadedAt: new Date().toISOString(),
        type: 'photo'
      };

      return {
        ...state,
        memories: {
          ...state.memories,
          photos: [...state.memories.photos, photo],
          timeline: [...state.memories.timeline, photo].sort(
            (a, b) => new Date(b.date || b.uploadedAt) - new Date(a.date || a.uploadedAt)
          )
        }
      };

    case MILESTONE_ACTIONS.ADD_NOTE:
      const note = {
        id: `note-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        type: 'note'
      };

      return {
        ...state,
        memories: {
          ...state.memories,
          notes: [...state.memories.notes, note],
          timeline: [...state.memories.timeline, note].sort(
            (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
          )
        }
      };

    case MILESTONE_ACTIONS.UPDATE_CELEBRATION_SETTINGS:
      return {
        ...state,
        celebrations: { ...state.celebrations, ...action.payload }
      };

    case MILESTONE_ACTIONS.SHARE_MILESTONE:
      const sharedMilestone = {
        milestoneId: action.payload.milestoneId,
        sharedAt: new Date().toISOString(),
        platform: action.payload.platform,
        audience: action.payload.audience
      };

      return {
        ...state,
        sharing: {
          ...state.sharing,
          publicMilestones: [...state.sharing.publicMilestones, sharedMilestone]
        }
      };

    case MILESTONE_ACTIONS.ADD_CELEBRATION_MESSAGE:
      return {
        ...state,
        sharing: {
          ...state.sharing,
          celebrationMessages: [...state.sharing.celebrationMessages, action.payload]
        }
      };

    case MILESTONE_ACTIONS.CALCULATE_PROGRESS:
      const allMilestones = [...state.milestones.preset, ...state.milestones.custom];
      const achievedCount = state.milestones.achieved.length;
      const totalMilestones = allMilestones.length;
      const completionPercentage = totalMilestones > 0 ? (achievedCount / totalMilestones) * 100 : 0;

      return {
        ...state,
        progress: {
          ...state.progress,
          totalMilestones,
          achievedCount,
          completionPercentage,
          upcomingCount: totalMilestones - achievedCount
        }
      };

    default:
      return state;
  }
}

// MilestoneProvider component
export function MilestoneProvider({ children }) {
  const [state, dispatch] = useReducer(milestoneReducer, initialState);
  const { pregnancyData } = useApp();
  
  // Save data when state changes (but not on initial load)
  const [isInitialized, setIsInitialized] = useState(false);

  // Load default milestones and persisted data
  useEffect(() => {
    dispatch({ type: MILESTONE_ACTIONS.LOAD_DEFAULT_MILESTONES });
    loadMilestoneData();
  }, []);

  // Migrate existing achievements with incorrect dates
  useEffect(() => {
    if (isInitialized && pregnancyData.dueDate) {
      migrateAchievementDates();
    }
  }, [isInitialized, pregnancyData.dueDate]);

  // Auto-detect milestone achievements based on current week
  useEffect(() => {
    if (pregnancyData.currentWeek > 0 && state.celebrations.autoDetectMilestones) {
      checkAutoDetectableMilestones();
    }
  }, [pregnancyData.currentWeek, state.celebrations.autoDetectMilestones]);

  // Recalculate progress when milestones change
  useEffect(() => {
    dispatch({ type: MILESTONE_ACTIONS.CALCULATE_PROGRESS });
  }, [state.milestones.achieved, state.milestones.custom]);

  useEffect(() => {
    if (isInitialized) {
      console.log('Saving milestone data due to state change:', state);
      saveMilestoneData();
    }
  }, [state, isInitialized]);

  // Helper function to calculate date for a specific pregnancy week
  const calculateDateForWeek = (targetWeek, dueDate) => {
    if (!dueDate || !targetWeek) return new Date().toISOString();
    
    const due = new Date(dueDate);
    const pregnancyDuration = 40 * 7 * 24 * 60 * 60 * 1000; // 40 weeks in milliseconds
    const startDate = new Date(due.getTime() - pregnancyDuration);
    const targetDate = new Date(startDate.getTime() + (targetWeek * 7 * 24 * 60 * 60 * 1000));
    
    return targetDate.toISOString();
  };

  // Auto-detect milestones
  const checkAutoDetectableMilestones = () => {
    const currentWeek = pregnancyData.currentWeek;
    const dueDate = pregnancyData.dueDate;
    console.log('Checking auto-detectable milestones for week:', currentWeek);
    console.log('Current achieved milestones:', state.milestones.achieved);
    
    const autoDetectableMilestones = DEFAULT_MILESTONES.filter(
      milestone => {
        const isAutoDetectable = milestone.isAutoDetectable;
        const isAtOrPastWeek = milestone.week <= currentWeek;
        const isNotAlreadyAchieved = !state.milestones.achieved.find(achieved => achieved.id === milestone.id);
        
        console.log(`Milestone ${milestone.title}:`, {
          isAutoDetectable,
          isAtOrPastWeek,
          isNotAlreadyAchieved,
          milestoneWeek: milestone.week,
          currentWeek
        });
        
        return isAutoDetectable && isAtOrPastWeek && isNotAlreadyAchieved;
      }
    );

    console.log('Auto-detectable milestones to achieve:', autoDetectableMilestones);

    autoDetectableMilestones.forEach(milestone => {
      console.log('Auto-achieving milestone:', milestone.title);
      const achievementDate = calculateDateForWeek(milestone.week, dueDate);
      
      dispatch({
        type: MILESTONE_ACTIONS.ACHIEVE_MILESTONE,
        payload: {
          milestone: {
            ...milestone,
            achievedAt: achievementDate
          },
          notes: `Automatically achieved at week ${milestone.week}`,
          mood: 'good'
        }
      });
    });
  };

  // Migrate existing achievements with incorrect dates
  const migrateAchievementDates = () => {
    const achievedMilestones = state.milestones.achieved;
    let needsMigration = false;

    const migratedAchievements = achievedMilestones.map(achievement => {
      // Check if this is an auto-detectable milestone with today's date that should be corrected
      const isAutoDetectable = DEFAULT_MILESTONES.find(m => m.id === achievement.id)?.isAutoDetectable;
      const achievedDate = new Date(achievement.achievedAt);
      const today = new Date();
      const isToday = achievedDate.toDateString() === today.toDateString();
      
      if (isAutoDetectable && isToday && achievement.week) {
        needsMigration = true;
        const correctDate = calculateDateForWeek(achievement.week, pregnancyData.dueDate);
        return {
          ...achievement,
          achievedAt: correctDate
        };
      }
      
      return achievement;
    });

    if (needsMigration) {
      console.log('Migrating achievement dates to match pregnancy timeline');
      dispatch({
        type: MILESTONE_ACTIONS.LOAD_DATA,
        payload: {
          ...state,
          milestones: {
            ...state.milestones,
            achieved: migratedAchievements
          }
        }
      });
    }
  };

  // Local storage functions
  const saveMilestoneData = () => {
    try {
      localStorage.setItem('bloomtrack_milestone_data', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving milestone data:', error);
    }
  };

  const loadMilestoneData = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_milestone_data');
      console.log('Loading milestone data from localStorage:', saved);
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log('Parsed milestone data:', parsedData);
        
        // Restore the data to state
        dispatch({
          type: MILESTONE_ACTIONS.LOAD_DATA,
          payload: parsedData
        });
      } else {
        console.log('No milestone data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading milestone data:', error);
    } finally {
      // Set initialized to true after attempting to load
      setIsInitialized(true);
    }
  };

  // Action creators
  const actions = {
    // Milestone management
    addCustomMilestone: (milestoneData) => {
      dispatch({
        type: MILESTONE_ACTIONS.ADD_CUSTOM_MILESTONE,
        payload: milestoneData
      });
    },

    updateMilestone: (id, updates, milestoneType = 'custom') => {
      dispatch({
        type: MILESTONE_ACTIONS.UPDATE_MILESTONE,
        payload: { id, updates, milestoneType }
      });
    },

    deleteMilestone: (milestoneId, type = 'custom') => {
      dispatch({
        type: MILESTONE_ACTIONS.DELETE_MILESTONE,
        payload: { milestoneId, type }
      });
    },

    // Achievement actions
    achieveMilestone: (milestone, photos = [], notes = '', mood = 'excellent') => {
      // If no achievement date is provided, calculate it based on the milestone week
      const achievementDate = milestone.achievedAt || calculateDateForWeek(milestone.week, pregnancyData.dueDate);
      
      dispatch({
        type: MILESTONE_ACTIONS.ACHIEVE_MILESTONE,
        payload: { 
          milestone: {
            ...milestone,
            achievedAt: achievementDate
          }, 
          photos, 
          notes, 
          mood 
        }
      });

      // Trigger celebration if enabled
      if (state.celebrations.enableAnimations) {
        triggerCelebration(milestone);
      }
    },

    undoAchievement: (milestoneId) => {
      dispatch({
        type: MILESTONE_ACTIONS.UNDO_ACHIEVEMENT,
        payload: milestoneId
      });
    },

    // Memory management
    addPhoto: (photoData) => {
      dispatch({
        type: MILESTONE_ACTIONS.ADD_PHOTO,
        payload: photoData
      });
    },

    addNote: (noteData) => {
      dispatch({
        type: MILESTONE_ACTIONS.ADD_NOTE,
        payload: noteData
      });
    },

    // Quick achievement with photo
    achieveWithPhoto: (milestone, photoFile, notes = '') => {
      // In a real app, you'd upload the photo to a server
      // For now, we'll create a URL for the local file
      const photoURL = URL.createObjectURL(photoFile);
      
      const photo = {
        url: photoURL,
        fileName: photoFile.name,
        fileSize: photoFile.size,
        milestoneId: milestone.id
      };

      actions.achieveMilestone(milestone, [photo], notes);
    },

    // Celebration settings
    updateCelebrationSettings: (settings) => {
      dispatch({
        type: MILESTONE_ACTIONS.UPDATE_CELEBRATION_SETTINGS,
        payload: settings
      });
    },

    // Sharing actions
    shareMilestone: (milestoneId, platform, audience = 'public') => {
      dispatch({
        type: MILESTONE_ACTIONS.SHARE_MILESTONE,
        payload: { milestoneId, platform, audience }
      });
    },

    addCelebrationMessage: (message) => {
      dispatch({
        type: MILESTONE_ACTIONS.ADD_CELEBRATION_MESSAGE,
        payload: {
          ...message,
          id: `message-${Date.now()}`,
          receivedAt: new Date().toISOString()
        }
      });
    }
  };

  // Trigger celebration animation/notification
  const triggerCelebration = (milestone) => {
    // This would trigger animations, confetti, etc.
    if (state.celebrations.enableNotifications && 'Notification' in window) {
      new Notification(`🎉 Milestone Achieved: ${milestone.title}`, {
        body: milestone.celebrationMessage,
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  // Computed values
  const computedValues = {
    // Get all milestones (preset + custom) sorted by week
    getAllMilestones: () => {
      return [...state.milestones.preset, ...state.milestones.custom]
        .sort((a, b) => a.week - b.week);
    },

    // Get upcoming milestones based on current week
    getUpcomingMilestones: (limit = 3) => {
      const allMilestones = computedValues.getAllMilestones();
      const currentWeek = pregnancyData.currentWeek;
      
      return allMilestones
        .filter(milestone => 
          milestone.week >= currentWeek &&
          !state.milestones.achieved.find(achieved => achieved.id === milestone.id)
        )
        .sort((a, b) => a.week - b.week)
        .slice(0, limit);
    },

    // Get recent achievements (newest first)
    getRecentAchievements: (limit = 5) => {
      return state.milestones.achieved
        .sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt))
        .slice(0, limit);
    },

    // Get all achievements in chronological order (oldest first)
    getAchievementsChronological: () => {
      return state.milestones.achieved
        .sort((a, b) => new Date(a.achievedAt) - new Date(b.achievedAt));
    },

    // Get milestones by category
    getMilestonesByCategory: (category) => {
      const allMilestones = computedValues.getAllMilestones();
      return allMilestones.filter(milestone => milestone.category === category);
    },

    // Get achievement statistics
    getAchievementStats: () => {
      const achieved = state.milestones.achieved;
      const categories = {};
      
      achieved.forEach(milestone => {
        categories[milestone.category] = (categories[milestone.category] || 0) + 1;
      });

      return {
        total: achieved.length,
        byCategory: categories,
        thisWeek: achieved.filter(m => {
          const achievedDate = new Date(m.achievedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return achievedDate >= weekAgo;
        }).length,
        thisMonth: achieved.filter(m => {
          const achievedDate = new Date(m.achievedAt);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return achievedDate >= monthAgo;
        }).length
      };
    },

    // Check if milestone is achieved
    isMilestoneAchieved: (milestoneId) => {
      return state.milestones.achieved.some(milestone => milestone.id === milestoneId);
    },

    // Get next milestone to achieve
    getNextMilestone: () => {
      const upcoming = computedValues.getUpcomingMilestones(1);
      return upcoming.length > 0 ? upcoming[0] : null;
    },

    // Get memory timeline
    getMemoryTimeline: () => {
      return state.memories.timeline;
    }
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computedValues,
    
    // Constants
    DEFAULT_MILESTONES,
    MILESTONE_CATEGORIES
  };

  return (
    <MilestoneContext.Provider value={contextValue}>
      {children}
    </MilestoneContext.Provider>
  );
}

// Custom hook to use MilestoneContext
export function useMilestones() {
  const context = useContext(MilestoneContext);
  
  if (!context) {
    throw new Error('useMilestones must be used within a MilestoneProvider');
  }
  
  return context;
}

// Export action types and constants
export { MILESTONE_ACTIONS, DEFAULT_MILESTONES, MILESTONE_CATEGORIES };