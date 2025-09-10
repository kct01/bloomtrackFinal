import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useApp } from './AppContext';

// Create the context
const SymptomsContext = createContext();

// Initial state
const initialState = {
  // Daily symptom entries
  dailyEntries: [], // Array of { date, symptoms: [{ name, severity, notes, time }] }
  
  // Symptom tracking
  tracking: {
    favoriteSymptoms: [], // Most commonly tracked symptoms
    customSymptoms: [], // User-added custom symptoms
    reminders: {
      enabled: true,
      time: '20:00', // Daily reminder time
      frequency: 'daily' // daily, weekly
    }
  },

  // Analytics and patterns
  analytics: {
    weeklyPatterns: {},
    severityTrends: {},
    commonTimes: {}, // Time of day patterns
    trimesterComparison: {
      1: { symptoms: [], averageSeverity: 0 },
      2: { symptoms: [], averageSeverity: 0 },
      3: { symptoms: [], averageSeverity: 0 }
    }
  },

  // Reports and insights
  reports: {
    weeklyReport: null,
    monthlyReport: null,
    trimesterReport: null,
    doctorReport: null // Formatted for sharing with healthcare provider
  },

  // Settings
  settings: {
    showSeverityScale: true,
    allowCustomSymptoms: true,
    trackSymptomTimes: true,
    generateReports: true,
    shareWithPartner: false
  }
};

// Comprehensive list of pregnancy symptoms
const PREGNANCY_SYMPTOMS = {
  // First Trimester Common
  'morning-sickness': { 
    label: 'Morning Sickness', 
    icon: '🤢', 
    category: 'digestive',
    trimester: [1, 2],
    description: 'Nausea and vomiting, often in the morning'
  },
  'nausea': { 
    label: 'Nausea', 
    icon: '🤮', 
    category: 'digestive',
    trimester: [1, 2],
    description: 'Feeling sick to your stomach'
  },
  'fatigue': { 
    label: 'Fatigue', 
    icon: '😴', 
    category: 'energy',
    trimester: [1, 3],
    description: 'Extreme tiredness and low energy'
  },
  'breast-tenderness': { 
    label: 'Breast Tenderness', 
    icon: '🤱', 
    category: 'physical',
    trimester: [1, 2],
    description: 'Sore, swollen, or tender breasts'
  },
  'frequent-urination': { 
    label: 'Frequent Urination', 
    icon: '🚽', 
    category: 'urinary',
    trimester: [1, 3],
    description: 'Need to urinate more often than usual'
  },
  'food-aversions': { 
    label: 'Food Aversions', 
    icon: '🙅‍♀️', 
    category: 'digestive',
    trimester: [1, 2],
    description: 'Strong dislike for certain foods or smells'
  },
  'food-cravings': { 
    label: 'Food Cravings', 
    icon: '🍰', 
    category: 'digestive',
    trimester: [1, 2, 3],
    description: 'Strong desire for specific foods'
  },
  'mood-swings': { 
    label: 'Mood Swings', 
    icon: '😭', 
    category: 'emotional',
    trimester: [1, 2, 3],
    description: 'Rapid changes in emotions'
  },
  'emotional': { 
    label: 'Emotional Changes', 
    icon: '💭', 
    category: 'emotional',
    trimester: [1, 2, 3],
    description: 'Feeling more emotional or sensitive'
  },

  // Second Trimester Common
  'heartburn': { 
    label: 'Heartburn', 
    icon: '🔥', 
    category: 'digestive',
    trimester: [2, 3],
    description: 'Burning sensation in chest or throat'
  },
  'constipation': { 
    label: 'Constipation', 
    icon: '😣', 
    category: 'digestive',
    trimester: [1, 2, 3],
    description: 'Difficulty having bowel movements'
  },
  'back-pain': { 
    label: 'Back Pain', 
    icon: '🤕', 
    category: 'physical',
    trimester: [2, 3],
    description: 'Pain in lower or upper back'
  },
  'round-ligament-pain': { 
    label: 'Round Ligament Pain', 
    icon: '⚡', 
    category: 'physical',
    trimester: [2],
    description: 'Sharp pain in lower abdomen or groin'
  },
  'skin-changes': { 
    label: 'Skin Changes', 
    icon: '✨', 
    category: 'physical',
    trimester: [2, 3],
    description: 'Stretch marks, dark patches, or acne'
  },

  // Third Trimester Common
  'shortness-of-breath': { 
    label: 'Shortness of Breath', 
    icon: '💨', 
    category: 'respiratory',
    trimester: [3],
    description: 'Feeling breathless or winded easily'
  },
  'swelling': { 
    label: 'Swelling', 
    icon: '🦵', 
    category: 'physical',
    trimester: [3],
    description: 'Swelling in hands, feet, or face'
  },
  'insomnia': { 
    label: 'Insomnia', 
    icon: '🌙', 
    category: 'sleep',
    trimester: [3],
    description: 'Difficulty falling or staying asleep'
  },
  'leg-cramps': { 
    label: 'Leg Cramps', 
    icon: '🦵', 
    category: 'physical',
    trimester: [3],
    description: 'Painful muscle cramps in legs'
  },
  'pelvic-pressure': { 
    label: 'Pelvic Pressure', 
    icon: '⬇️', 
    category: 'physical',
    trimester: [3],
    description: 'Pressure or heaviness in pelvis'
  },
  'braxton-hicks': { 
    label: 'Braxton Hicks Contractions', 
    icon: '🤰', 
    category: 'physical',
    trimester: [2, 3],
    description: 'Practice contractions that tighten the uterus'
  },

  // General Symptoms
  'headaches': { 
    label: 'Headaches', 
    icon: '🤕', 
    category: 'physical',
    trimester: [1, 2, 3],
    description: 'Head pain or pressure'
  },
  'dizziness': { 
    label: 'Dizziness', 
    icon: '💫', 
    category: 'physical',
    trimester: [1, 2],
    description: 'Feeling lightheaded or unsteady'
  },
  'hot-flashes': { 
    label: 'Hot Flashes', 
    icon: '🥵', 
    category: 'physical',
    trimester: [1, 2, 3],
    description: 'Sudden feeling of warmth or heat'
  },
  'increased-appetite': { 
    label: 'Increased Appetite', 
    icon: '🍽️', 
    category: 'digestive',
    trimester: [2, 3],
    description: 'Feeling hungrier than usual'
  },
  'decreased-appetite': { 
    label: 'Decreased Appetite', 
    icon: '🚫', 
    category: 'digestive',
    trimester: [1],
    description: 'Not feeling like eating'
  }
};

// Symptom categories for filtering
const SYMPTOM_CATEGORIES = {
  digestive: { label: 'Digestive', icon: '🍽️', color: '#FFB5A7' },
  physical: { label: 'Physical', icon: '🤕', color: '#F4A6CD' },
  emotional: { label: 'Emotional', icon: '💭', color: '#C8A8E9' },
  sleep: { label: 'Sleep', icon: '😴', color: '#A8D8A8' },
  energy: { label: 'Energy', icon: '⚡', color: '#F4A261' },
  respiratory: { label: 'Breathing', icon: '💨', color: '#E8B4B8' },
  urinary: { label: 'Urinary', icon: '🚽', color: '#B5E7A0' }
};

// Severity levels
const SEVERITY_LEVELS = {
  1: { label: 'Very Mild', color: '#A8D8A8', description: 'Barely noticeable' },
  2: { label: 'Mild', color: '#C8A8E9', description: 'Noticeable but not bothersome' },
  3: { label: 'Moderate', color: '#FFB5A7', description: 'Somewhat bothersome' },
  4: { label: 'Severe', color: '#F4A6CD', description: 'Very bothersome' },
  5: { label: 'Very Severe', color: '#E76F51', description: 'Extremely bothersome' }
};

// Action types
const SYMPTOMS_ACTIONS = {
  // Daily entry management
  ADD_DAILY_ENTRY: 'ADD_DAILY_ENTRY',
  UPDATE_DAILY_ENTRY: 'UPDATE_DAILY_ENTRY',
  DELETE_DAILY_ENTRY: 'DELETE_DAILY_ENTRY',
  
  // Symptom management
  ADD_SYMPTOM_TO_ENTRY: 'ADD_SYMPTOM_TO_ENTRY',
  UPDATE_SYMPTOM_IN_ENTRY: 'UPDATE_SYMPTOM_IN_ENTRY',
  REMOVE_SYMPTOM_FROM_ENTRY: 'REMOVE_SYMPTOM_FROM_ENTRY',
  
  // Custom symptoms
  ADD_CUSTOM_SYMPTOM: 'ADD_CUSTOM_SYMPTOM',
  UPDATE_CUSTOM_SYMPTOM: 'UPDATE_CUSTOM_SYMPTOM',
  DELETE_CUSTOM_SYMPTOM: 'DELETE_CUSTOM_SYMPTOM',
  
  // Favorites
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  
  // Analytics
  CALCULATE_ANALYTICS: 'CALCULATE_ANALYTICS',
  GENERATE_REPORT: 'GENERATE_REPORT',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPDATE_REMINDERS: 'UPDATE_REMINDERS',
  
  // Data loading
  LOAD_DATA: 'LOAD_DATA'
};

// Reducer function
function symptomsReducer(state, action) {
  switch (action.type) {
    case SYMPTOMS_ACTIONS.ADD_DAILY_ENTRY:
      const newEntry = {
        id: `entry-${Date.now()}`,
        date: action.payload.date,
        symptoms: action.payload.symptoms || [],
        notes: action.payload.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        ...state,
        dailyEntries: [...state.dailyEntries, newEntry].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        )
      };

    case SYMPTOMS_ACTIONS.UPDATE_DAILY_ENTRY:
      return {
        ...state,
        dailyEntries: state.dailyEntries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : entry
        )
      };

    case SYMPTOMS_ACTIONS.DELETE_DAILY_ENTRY:
      return {
        ...state,
        dailyEntries: state.dailyEntries.filter(entry => entry.id !== action.payload)
      };

    case SYMPTOMS_ACTIONS.ADD_SYMPTOM_TO_ENTRY:
      const { entryId, symptom } = action.payload;
      return {
        ...state,
        dailyEntries: state.dailyEntries.map(entry =>
          entry.id === entryId
            ? {
                ...entry,
                symptoms: [...entry.symptoms, {
                  id: `symptom-${Date.now()}`,
                  ...symptom,
                  loggedAt: new Date().toISOString()
                }],
                updatedAt: new Date().toISOString()
              }
            : entry
        )
      };

    case SYMPTOMS_ACTIONS.ADD_CUSTOM_SYMPTOM:
      const customSymptom = {
        id: `custom-${Date.now()}`,
        ...action.payload,
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        tracking: {
          ...state.tracking,
          customSymptoms: [...state.tracking.customSymptoms, customSymptom]
        }
      };

    case SYMPTOMS_ACTIONS.ADD_TO_FAVORITES:
      return {
        ...state,
        tracking: {
          ...state.tracking,
          favoriteSymptoms: [...state.tracking.favoriteSymptoms, action.payload]
        }
      };

    case SYMPTOMS_ACTIONS.REMOVE_FROM_FAVORITES:
      return {
        ...state,
        tracking: {
          ...state.tracking,
          favoriteSymptoms: state.tracking.favoriteSymptoms.filter(
            symptom => symptom !== action.payload
          )
        }
      };

    case SYMPTOMS_ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case SYMPTOMS_ACTIONS.UPDATE_REMINDERS:
      return {
        ...state,
        tracking: {
          ...state.tracking,
          reminders: { ...state.tracking.reminders, ...action.payload }
        }
      };

    case SYMPTOMS_ACTIONS.CALCULATE_ANALYTICS:
      const analytics = calculateSymptomsAnalytics(state.dailyEntries, action.payload.currentWeek);
      return {
        ...state,
        analytics
      };

    case SYMPTOMS_ACTIONS.LOAD_DATA:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Helper function to calculate analytics
function calculateSymptomsAnalytics(dailyEntries, currentWeek) {
  const analytics = {
    weeklyPatterns: {},
    severityTrends: {},
    commonTimes: {},
    trimesterComparison: {
      1: { symptoms: [], averageSeverity: 0 },
      2: { symptoms: [], averageSeverity: 0 },
      3: { symptoms: [], averageSeverity: 0 }
    }
  };

  // Calculate weekly patterns
  dailyEntries.forEach(entry => {
    const entryDate = new Date(entry.date);
    const week = Math.ceil((Date.now() - entryDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    if (!analytics.weeklyPatterns[week]) {
      analytics.weeklyPatterns[week] = [];
    }
    
    entry.symptoms.forEach(symptom => {
      analytics.weeklyPatterns[week].push({
        name: symptom.name,
        severity: symptom.severity
      });
    });
  });

  return analytics;
}

// SymptomsProvider component
export function SymptomsProvider({ children }) {
  const [state, dispatch] = useReducer(symptomsReducer, initialState);
  const { pregnancyData } = useApp();
  const [isLoaded, setIsLoaded] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    loadSymptomsData();
  }, []);

  // Save data when state changes (but not on initial load)
  useEffect(() => {
    if (isLoaded) {
      saveSymptomsData();
    }
  }, [state, isLoaded]);

  // Calculate analytics when entries change
  useEffect(() => {
    if (state.dailyEntries.length > 0 && pregnancyData?.currentWeek) {
      dispatch({
        type: SYMPTOMS_ACTIONS.CALCULATE_ANALYTICS,
        payload: { currentWeek: pregnancyData.currentWeek }
      });
    }
  }, [state.dailyEntries, pregnancyData?.currentWeek]);

  // Local storage functions
  const saveSymptomsData = () => {
    try {
      localStorage.setItem('bloomtrack_symptoms_data', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving symptoms data:', error);
    }
  };

  const loadSymptomsData = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_symptoms_data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        
        dispatch({
          type: SYMPTOMS_ACTIONS.LOAD_DATA,
          payload: parsedData
        });
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading symptoms data:', error);
      setIsLoaded(true);
    }
  };

  // Action creators
  const actions = {
    // Daily entries
    addDailyEntry: (date, symptoms, notes = '') => {
      dispatch({
        type: SYMPTOMS_ACTIONS.ADD_DAILY_ENTRY,
        payload: { date, symptoms, notes }
      });
    },

    updateDailyEntry: (id, updates) => {
      dispatch({
        type: SYMPTOMS_ACTIONS.UPDATE_DAILY_ENTRY,
        payload: { id, updates }
      });
    },

    deleteDailyEntry: (id) => {
      dispatch({
        type: SYMPTOMS_ACTIONS.DELETE_DAILY_ENTRY,
        payload: id
      });
    },

    // Quick symptom logging
    logSymptom: (symptomName, severity, notes = '', time = null) => {
      const today = new Date().toISOString().split('T')[0];
      const existingEntry = state.dailyEntries.find(entry => entry.date === today);
      
      const symptom = {
        name: symptomName,
        severity,
        notes,
        time: time || new Date().toTimeString().slice(0, 5)
      };

      if (existingEntry) {
        dispatch({
          type: SYMPTOMS_ACTIONS.ADD_SYMPTOM_TO_ENTRY,
          payload: { entryId: existingEntry.id, symptom }
        });
      } else {
        dispatch({
          type: SYMPTOMS_ACTIONS.ADD_DAILY_ENTRY,
          payload: { date: today, symptoms: [symptom] }
        });
      }
    },

    // Custom symptoms
    addCustomSymptom: (symptomData) => {
      dispatch({
        type: SYMPTOMS_ACTIONS.ADD_CUSTOM_SYMPTOM,
        payload: symptomData
      });
    },

    // Favorites
    addToFavorites: (symptomName) => {
      if (!state.tracking.favoriteSymptoms.includes(symptomName)) {
        dispatch({
          type: SYMPTOMS_ACTIONS.ADD_TO_FAVORITES,
          payload: symptomName
        });
      }
    },

    removeFromFavorites: (symptomName) => {
      dispatch({
        type: SYMPTOMS_ACTIONS.REMOVE_FROM_FAVORITES,
        payload: symptomName
      });
    },

    // Settings
    updateSettings: (settings) => {
      dispatch({
        type: SYMPTOMS_ACTIONS.UPDATE_SETTINGS,
        payload: settings
      });
    },

    updateReminders: (reminders) => {
      dispatch({
        type: SYMPTOMS_ACTIONS.UPDATE_REMINDERS,
        payload: reminders
      });
    }
  };

  // Computed values
  const computedValues = {
    // Get all available symptoms (pregnancy symptoms + custom)
    getAllSymptoms: () => {
      const allSymptoms = { ...PREGNANCY_SYMPTOMS };
      
      state.tracking.customSymptoms.forEach(custom => {
        allSymptoms[custom.id] = custom;
      });
      
      return allSymptoms;
    },

    // Get symptoms for specific date
    getSymptomsForDate: (date) => {
      return state.dailyEntries.find(entry => entry.date === date);
    },

    // Get recent entries
    getRecentEntries: (limit = 7) => {
      return state.dailyEntries.slice(0, limit);
    },

    // Get symptoms by category
    getSymptomsByCategory: (category) => {
      return Object.entries(PREGNANCY_SYMPTOMS).filter(
        ([key, symptom]) => symptom.category === category
      );
    },

    // Get favorite symptoms data
    getFavoriteSymptoms: () => {
      return state.tracking.favoriteSymptoms.map(name => 
        PREGNANCY_SYMPTOMS[name] || state.tracking.customSymptoms.find(c => c.id === name)
      ).filter(Boolean);
    },

    // Get symptoms by trimester
    getSymptomsByTrimester: (trimester) => {
      return Object.entries(PREGNANCY_SYMPTOMS).filter(
        ([key, symptom]) => symptom.trimester.includes(trimester)
      );
    },

    // Get symptom statistics
    getSymptomsStats: () => {
      const totalEntries = state.dailyEntries.length;
      const totalSymptoms = state.dailyEntries.reduce((acc, entry) => acc + entry.symptoms.length, 0);
      const uniqueSymptoms = new Set(
        state.dailyEntries.flatMap(entry => entry.symptoms.map(s => s.name))
      ).size;

      const mostCommonSymptom = getMostCommonSymptom(state.dailyEntries);
      const averageSeverity = calculateAverageSeverity(state.dailyEntries);

      return {
        totalEntries,
        totalSymptoms,
        uniqueSymptoms,
        mostCommonSymptom,
        averageSeverity,
        currentStreak: calculateCurrentStreak(state.dailyEntries)
      };
    }
  };

  // Helper functions for statistics
  function getMostCommonSymptom(entries) {
    const symptomCounts = {};
    entries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        symptomCounts[symptom.name] = (symptomCounts[symptom.name] || 0) + 1;
      });
    });

    return Object.keys(symptomCounts).reduce((a, b) => 
      symptomCounts[a] > symptomCounts[b] ? a : b, null
    );
  }

  function calculateAverageSeverity(entries) {
    let totalSeverity = 0;
    let count = 0;

    entries.forEach(entry => {
      entry.symptoms.forEach(symptom => {
        totalSeverity += symptom.severity;
        count++;
      });
    });

    return count > 0 ? (totalSeverity / count).toFixed(1) : 0;
  }

  function calculateCurrentStreak(entries) {
    if (entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const currentDate = new Date(today);

    while (streak < entries.length) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const entry = entries.find(e => e.date === dateStr);
      
      if (entry && entry.symptoms.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computedValues,
    
    // Constants
    PREGNANCY_SYMPTOMS,
    SYMPTOM_CATEGORIES,
    SEVERITY_LEVELS
  };

  return (
    <SymptomsContext.Provider value={contextValue}>
      {children}
    </SymptomsContext.Provider>
  );
}

// Custom hook to use SymptomsContext
export function useSymptoms() {
  const context = useContext(SymptomsContext);
  
  if (!context) {
    throw new Error('useSymptoms must be used within a SymptomsProvider');
  }
  
  return context;
}

// Export action types and constants
export { SYMPTOMS_ACTIONS, PREGNANCY_SYMPTOMS, SYMPTOM_CATEGORIES, SEVERITY_LEVELS };