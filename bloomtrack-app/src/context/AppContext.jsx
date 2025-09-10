import { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Create the context
const AppContext = createContext();

// Initial state for the entire app
const initialState = {
  // User information
  user: {
    name: '',
    email: '',
    profilePicture: null,
    preferences: {
      notifications: true,
      theme: 'default',
      privacy: 'private'
    }
  },
  
  // Pregnancy data
  pregnancyData: {
    dueDate: '2025-08-15',
    currentWeek: 22,
    trimester: 2,
    babyName: 'Little One',
    lastMenstrualPeriod: '2025-01-15',
    isFirstTime: true,
    // Baby details
    babyDetails: {
      name: 'Little One', // Initialize with the same as babyName
      gender: 'surprise', // 'boy', 'girl', 'surprise'
      weight: '',
      length: '',
      profilePhoto: null
    }
  },
  
  // App state
  isLoading: false,
  error: null,
  isOnboarded: true,
  
  // Navigation
  currentPage: 'dashboard',
  
  // Feature flags
  features: {
    milestones: true,
    calendar: true,
    journal: true,
    chat: true,
    notifications: true
  }
};

// Action types for state management
const ACTION_TYPES = {
  // User actions
  SET_USER: 'SET_USER',
  UPDATE_USER_PREFERENCES: 'UPDATE_USER_PREFERENCES',
  
  // Pregnancy actions
  SET_PREGNANCY_DATA: 'SET_PREGNANCY_DATA',
  UPDATE_CURRENT_WEEK: 'UPDATE_CURRENT_WEEK',
  SET_DUE_DATE: 'SET_DUE_DATE',
  UPDATE_BABY_DETAILS: 'UPDATE_BABY_DETAILS',
  
  // App state actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ONBOARDED: 'SET_ONBOARDED',
  
  // Navigation actions
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  
  // Feature actions
  TOGGLE_FEATURE: 'TOGGLE_FEATURE'
};

// Reducer function to handle state changes
function appReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...action.payload }
        }
      };
      
    case ACTION_TYPES.SET_PREGNANCY_DATA:
      return {
        ...state,
        pregnancyData: { ...state.pregnancyData, ...action.payload }
      };
      
    case ACTION_TYPES.UPDATE_CURRENT_WEEK:
      return {
        ...state,
        pregnancyData: {
          ...state.pregnancyData,
          currentWeek: action.payload,
          trimester: calculateTrimester(action.payload)
        }
      };
      
    case ACTION_TYPES.SET_DUE_DATE:
      console.log('🗓️ Setting due date:', action.payload);
      const currentWeek = calculateCurrentWeek(action.payload);
      console.log('📊 Calculated current week:', currentWeek);
      return {
        ...state,
        pregnancyData: {
          ...state.pregnancyData,
          dueDate: action.payload,
          currentWeek: currentWeek,
          trimester: calculateTrimester(currentWeek)
        }
      };
      
    case ACTION_TYPES.UPDATE_BABY_DETAILS:
      return {
        ...state,
        pregnancyData: {
          ...state.pregnancyData,
          babyDetails: { ...state.pregnancyData.babyDetails, ...action.payload }
        }
      };
      
    case ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case ACTION_TYPES.SET_ONBOARDED:
      return {
        ...state,
        isOnboarded: action.payload
      };
      
    case ACTION_TYPES.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload
      };
      
    case ACTION_TYPES.TOGGLE_FEATURE:
      return {
        ...state,
        features: {
          ...state.features,
          [action.payload]: !state.features[action.payload]
        }
      };
      
    default:
      return state;
  }
}

// Helper functions for pregnancy calculations
function calculateCurrentWeek(dueDate) {
  if (!dueDate) return 0;
  
  try {
    // Create dates at noon to avoid timezone issues
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(12, 0, 0, 0);
    
    const pregnancyDuration = 40 * 7 * 24 * 60 * 60 * 1000; // 40 weeks in milliseconds
    const startDate = new Date(due.getTime() - pregnancyDuration);
    const timeDiff = today.getTime() - startDate.getTime();
    const weeksDiff = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
    
    return Math.max(0, Math.min(40, weeksDiff));
  } catch (error) {
    console.error('Error calculating current week:', error);
    return 0;
  }
}

function calculateTrimester(week) {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
}

// Local storage keys
const STORAGE_KEYS = {
  USER_DATA: 'bloomtrack_user_data',
  PREGNANCY_DATA: 'bloomtrack_pregnancy_data',
  APP_PREFERENCES: 'bloomtrack_app_preferences'
};

// AppProvider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on app start
  useEffect(() => {
    loadPersistedData();
    // Set flag after loading is complete
    setHasLoadedData(true);
  }, []);

  // Recalculate pregnancy week daily
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.pregnancyData.dueDate) {
        const currentWeek = calculateCurrentWeek(state.pregnancyData.dueDate);
        if (currentWeek !== state.pregnancyData.currentWeek) {
          dispatch({ type: ACTION_TYPES.UPDATE_CURRENT_WEEK, payload: currentWeek });
        }
      }
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, [state.pregnancyData.dueDate, state.pregnancyData.currentWeek]);

  // Save data to localStorage whenever state changes (but not on initial load)
  const [hasLoadedData, setHasLoadedData] = useState(false);
  
  useEffect(() => {
    // Don't save during initial load
    if (!hasLoadedData) {
      return;
    }
    
    // Save directly in useEffect to avoid closure issues
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      localStorage.setItem(STORAGE_KEYS.PREGNANCY_DATA, JSON.stringify(state.pregnancyData));
      localStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify({
        isOnboarded: state.isOnboarded
      }));
    } catch (error) {
      console.error('Error saving data to storage:', error);
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to save data' });
    }
  }, [state.user, state.pregnancyData, state.isOnboarded, hasLoadedData]);

  // Load persisted data from localStorage
  const loadPersistedData = () => {
    try {
      // Load user data
      const savedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        dispatch({ type: ACTION_TYPES.SET_USER, payload: userData });
      }

      // Load pregnancy data
      const savedPregnancyData = localStorage.getItem(STORAGE_KEYS.PREGNANCY_DATA);
      if (savedPregnancyData) {
        const pregnancyData = JSON.parse(savedPregnancyData);
        // Load the saved pregnancy data as-is - trust the saved currentWeek
        dispatch({ type: ACTION_TYPES.SET_PREGNANCY_DATA, payload: pregnancyData });
        
        // Don't automatically recalculate the week - only do this if the user hasn't set a specific week
        // This preserves manual updates to the current week
      }

      // Load app preferences
      const savedAppPreferences = localStorage.getItem(STORAGE_KEYS.APP_PREFERENCES);
      if (savedAppPreferences) {
        const appPreferences = JSON.parse(savedAppPreferences);
        dispatch({ type: ACTION_TYPES.SET_ONBOARDED, payload: appPreferences.isOnboarded || false });
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to load saved data' });
    }
  };

  // Save data to localStorage
  const saveDataToStorage = () => {
    try {
      console.log('💾 Saving pregnancy data to localStorage:', state.pregnancyData);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
      localStorage.setItem(STORAGE_KEYS.PREGNANCY_DATA, JSON.stringify(state.pregnancyData));
      localStorage.setItem(STORAGE_KEYS.APP_PREFERENCES, JSON.stringify({
        isOnboarded: state.isOnboarded
      }));
      console.log('✅ Data saved successfully');
    } catch (error) {
      console.error('Error saving data to storage:', error);
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: 'Failed to save data' });
    }
  };

  // Action creators (functions to dispatch actions)
  const actions = {
    // User actions
    setUser: (userData) => {
      dispatch({ type: ACTION_TYPES.SET_USER, payload: userData });
    },

    updateUser: (userData) => {
      dispatch({ type: ACTION_TYPES.SET_USER, payload: { ...state.user, ...userData } });
    },

    updateUserPreferences: (preferences) => {
      dispatch({ type: ACTION_TYPES.UPDATE_USER_PREFERENCES, payload: preferences });
    },

    // Pregnancy actions
    setPregnancyData: (pregnancyData) => {
      dispatch({ type: ACTION_TYPES.SET_PREGNANCY_DATA, payload: pregnancyData });
    },

    updatePregnancyData: (pregnancyData) => {
      dispatch({ type: ACTION_TYPES.SET_PREGNANCY_DATA, payload: { ...state.pregnancyData, ...pregnancyData } });
    },

    setDueDate: (dueDate) => {
      console.log('🎯 AppContext: setDueDate called with:', dueDate);
      dispatch({ type: ACTION_TYPES.SET_DUE_DATE, payload: dueDate });
    },

    updateCurrentWeek: (week) => {
      dispatch({ type: ACTION_TYPES.UPDATE_CURRENT_WEEK, payload: week });
    },

    updateBabyDetails: (babyDetails) => {
      dispatch({ type: ACTION_TYPES.UPDATE_BABY_DETAILS, payload: babyDetails });
    },

    // App state actions
    setLoading: (isLoading) => {
      dispatch({ type: ACTION_TYPES.SET_LOADING, payload: isLoading });
    },

    setError: (error) => {
      dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: ACTION_TYPES.CLEAR_ERROR });
    },

    setOnboarded: (isOnboarded) => {
      dispatch({ type: ACTION_TYPES.SET_ONBOARDED, payload: isOnboarded });
    },

    // Navigation actions
    setCurrentPage: (page) => {
      dispatch({ type: ACTION_TYPES.SET_CURRENT_PAGE, payload: page });
    },

    // Feature actions
    toggleFeature: (featureName) => {
      dispatch({ type: ACTION_TYPES.TOGGLE_FEATURE, payload: featureName });
    },

    // Utility actions
    resetApp: () => {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Context value that will be provided to children
  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    isPregnant: state.pregnancyData.dueDate && state.pregnancyData.currentWeek > 0,
    daysUntilDue: state.pregnancyData.dueDate ? 
      Math.max(0, Math.ceil((new Date(state.pregnancyData.dueDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0,
    progressPercentage: Math.min(100, (state.pregnancyData.currentWeek / 40) * 100),
    trimesterColor: getTrimesterColor(state.pregnancyData.trimester)
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Helper function to get trimester colors
function getTrimesterColor(trimester) {
  switch (trimester) {
    case 1:
      return '#F4A6CD'; // Soft pink
    case 2:
      return '#FFB5A7'; // Warm peach
    case 3:
      return '#A8D8A8'; // Sage green
    default:
      return '#F4A6CD';
  }
}

// Custom hook to use the AppContext
export function useApp() {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
}

// Export action types for use in other components
export { ACTION_TYPES };