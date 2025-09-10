import { createContext, useContext, useReducer, useEffect } from 'react';
import { useApp } from './AppContext';
import { 
  calculateCurrentWeek,
  calculateDueDate,
  calculateDaysRemaining,
  getCurrentTrimester,
  getTrimesterInfo,
  calculatePregnancyProgress,
  calculateTrimesterProgress,
  estimateBabyWeight,
  estimateBabyLength,
  isFullTerm,
  isOverdue,
  getPregnancyMilestones,
  validatePregnancyData
} from '../utils/pregnancyCalculations';

// Create the context
const PregnancyContext = createContext();

// Initial state for pregnancy-specific data
const initialState = {
  // Weekly development information
  weeklyInfo: {
    currentWeekData: null,
    babySize: '',
    developmentMilestones: [],
    maternalChanges: [],
    tipsAndAdvice: []
  },
  
  // Pregnancy symptoms tracking
  symptoms: {
    current: [],
    history: [],
    severity: 'mild' // mild, moderate, severe
  },
  
  // Medical appointments
  appointments: {
    next: null,
    upcoming: [],
    history: [],
    reminders: []
  },
  
  // Pregnancy milestones
  milestones: {
    achieved: [],
    upcoming: [],
    custom: []
  },
  
  // Health tracking
  health: {
    weight: [],
    bloodPressure: [],
    measurements: [],
    vitals: []
  },
  
  // Educational content
  education: {
    weeklyArticles: [],
    videos: [],
    checklist: [],
    preparations: []
  },
  
  // Preferences
  preferences: {
    reminderFrequency: 'daily',
    notificationTypes: ['appointments', 'milestones', 'weekly'],
    measurementUnit: 'imperial', // imperial or metric
    privacyLevel: 'private'
  }
};

// Action types
const PREGNANCY_ACTIONS = {
  // Weekly information
  SET_WEEKLY_INFO: 'SET_WEEKLY_INFO',
  UPDATE_BABY_SIZE: 'UPDATE_BABY_SIZE',
  
  // Symptoms
  ADD_SYMPTOM: 'ADD_SYMPTOM',
  UPDATE_SYMPTOM: 'UPDATE_SYMPTOM',
  REMOVE_SYMPTOM: 'REMOVE_SYMPTOM',
  
  // Appointments
  ADD_APPOINTMENT: 'ADD_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  COMPLETE_APPOINTMENT: 'COMPLETE_APPOINTMENT',
  
  // Milestones
  ACHIEVE_MILESTONE: 'ACHIEVE_MILESTONE',
  ADD_CUSTOM_MILESTONE: 'ADD_CUSTOM_MILESTONE',
  
  // Health tracking
  ADD_WEIGHT_ENTRY: 'ADD_WEIGHT_ENTRY',
  ADD_HEALTH_MEASUREMENT: 'ADD_HEALTH_MEASUREMENT',
  
  // Educational content
  SET_WEEKLY_CONTENT: 'SET_WEEKLY_CONTENT',
  MARK_CONTENT_READ: 'MARK_CONTENT_READ',
  
  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
};

// Sample weekly development data
const WEEKLY_DEVELOPMENT_DATA = {
  1: {
    babySize: 'Poppy seed',
    sizeInches: '0.05',
    developmentMilestones: [
      'Fertilization occurs',
      'Embryo begins to form'
    ],
    maternalChanges: [
      'You may not know you\'re pregnant yet',
      'Continue taking prenatal vitamins'
    ],
    tipsAndAdvice: [
      'Start taking folic acid',
      'Avoid alcohol and smoking',
      'Maintain a healthy diet'
    ]
  },
  12: {
    babySize: 'Lime',
    sizeInches: '2.1',
    developmentMilestones: [
      'All major organs formed',
      'Baby can make movements',
      'Heartbeat can be heard'
    ],
    maternalChanges: [
      'End of first trimester',
      'Morning sickness may improve',
      'Energy levels may increase'
    ],
    tipsAndAdvice: [
      'Schedule genetic screening',
      'Start announcing pregnancy',
      'Begin prenatal exercise routine'
    ]
  },
  20: {
    babySize: 'Banana',
    sizeInches: '6.5',
    developmentMilestones: [
      'Anatomy scan time',
      'Baby can hear sounds',
      'Gender may be visible'
    ],
    maternalChanges: [
      'Feeling baby movements',
      'Showing more prominently',
      'Increased appetite'
    ],
    tipsAndAdvice: [
      'Schedule anatomy ultrasound',
      'Start thinking about nursery',
      'Consider maternity clothes'
    ]
  }
  // We'll add more weeks as we develop
};

// Default milestones
const DEFAULT_MILESTONES = [
  { id: 'first-positive-test', name: 'First Positive Test', week: 4, achieved: false },
  { id: 'first-appointment', name: 'First Doctor Appointment', week: 8, achieved: false },
  { id: 'first-heartbeat', name: 'First Heartbeat', week: 10, achieved: false },
  { id: 'end-first-trimester', name: 'End of First Trimester', week: 12, achieved: false },
  { id: 'anatomy-scan', name: 'Anatomy Scan', week: 20, achieved: false },
  { id: 'first-kick', name: 'First Kick', week: 18, achieved: false },
  { id: 'gender-reveal', name: 'Gender Reveal', week: 20, achieved: false },
  { id: 'baby-shower', name: 'Baby Shower', week: 32, achieved: false },
  { id: 'maternity-photos', name: 'Maternity Photos', week: 34, achieved: false },
  { id: 'hospital-bag', name: 'Hospital Bag Packed', week: 36, achieved: false }
];

// Reducer function
function pregnancyReducer(state, action) {
  switch (action.type) {
    case PREGNANCY_ACTIONS.SET_WEEKLY_INFO:
      return {
        ...state,
        weeklyInfo: { ...state.weeklyInfo, ...action.payload }
      };

    case PREGNANCY_ACTIONS.UPDATE_BABY_SIZE:
      return {
        ...state,
        weeklyInfo: {
          ...state.weeklyInfo,
          babySize: action.payload
        }
      };

    case PREGNANCY_ACTIONS.ADD_SYMPTOM:
      return {
        ...state,
        symptoms: {
          ...state.symptoms,
          current: [...state.symptoms.current, action.payload],
          history: [...state.symptoms.history, { ...action.payload, date: new Date().toISOString() }]
        }
      };

    case PREGNANCY_ACTIONS.UPDATE_SYMPTOM:
      return {
        ...state,
        symptoms: {
          ...state.symptoms,
          current: state.symptoms.current.map(symptom =>
            symptom.id === action.payload.id ? { ...symptom, ...action.payload.updates } : symptom
          )
        }
      };

    case PREGNANCY_ACTIONS.REMOVE_SYMPTOM:
      return {
        ...state,
        symptoms: {
          ...state.symptoms,
          current: state.symptoms.current.filter(symptom => symptom.id !== action.payload)
        }
      };

    case PREGNANCY_ACTIONS.ADD_APPOINTMENT:
      return {
        ...state,
        appointments: {
          ...state.appointments,
          upcoming: [...state.appointments.upcoming, action.payload].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        }
      };

    case PREGNANCY_ACTIONS.COMPLETE_APPOINTMENT:
      const completedAppointment = state.appointments.upcoming.find(apt => apt.id === action.payload);
      return {
        ...state,
        appointments: {
          ...state.appointments,
          upcoming: state.appointments.upcoming.filter(apt => apt.id !== action.payload),
          history: [...state.appointments.history, { ...completedAppointment, completed: true }]
        }
      };

    case PREGNANCY_ACTIONS.ACHIEVE_MILESTONE:
      return {
        ...state,
        milestones: {
          ...state.milestones,
          achieved: [...state.milestones.achieved, action.payload]
        }
      };

    case PREGNANCY_ACTIONS.ADD_CUSTOM_MILESTONE:
      return {
        ...state,
        milestones: {
          ...state.milestones,
          custom: [...state.milestones.custom, action.payload]
        }
      };

    case PREGNANCY_ACTIONS.ADD_WEIGHT_ENTRY:
      return {
        ...state,
        health: {
          ...state.health,
          weight: [...state.health.weight, action.payload].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        }
      };

    case PREGNANCY_ACTIONS.ADD_HEALTH_MEASUREMENT:
      return {
        ...state,
        health: {
          ...state.health,
          [action.payload.type]: [...state.health[action.payload.type], action.payload.data]
        }
      };

    case PREGNANCY_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case PREGNANCY_ACTIONS.SET_WEEKLY_CONTENT:
      return {
        ...state,
        education: { ...state.education, ...action.payload }
      };

    default:
      return state;
  }
}

// PregnancyProvider component
export function PregnancyProvider({ children }) {
  const [state, dispatch] = useReducer(pregnancyReducer, initialState);
  const { pregnancyData } = useApp(); // Get pregnancy data from AppContext

  // Update weekly information when current week changes
  useEffect(() => {
    if (pregnancyData && pregnancyData.currentWeek > 0) {
      updateWeeklyInformation(pregnancyData.currentWeek);
      checkMilestones(pregnancyData.currentWeek);
    }
  }, [pregnancyData?.currentWeek]);

  // Load persisted pregnancy data
  useEffect(() => {
    loadPregnancyData();
  }, []);

  // Save pregnancy data when state changes
  useEffect(() => {
    savePregnancyData();
  }, [state]);

  // Update weekly information based on current week
  const updateWeeklyInformation = (week) => {
    const weekData = WEEKLY_DEVELOPMENT_DATA[week] || getDefaultWeekData(week);
    dispatch({
      type: PREGNANCY_ACTIONS.SET_WEEKLY_INFO,
      payload: {
        currentWeekData: weekData,
        babySize: weekData.babySize
      }
    });
  };

  // Check and update milestones
  const checkMilestones = (currentWeek) => {
    const upcomingMilestones = DEFAULT_MILESTONES.filter(
      milestone => milestone.week <= currentWeek && !state.milestones.achieved.find(m => m.id === milestone.id)
    );
    // Auto-achieve milestone if week has passed
    upcomingMilestones.forEach(milestone => {
      if (milestone.week <= currentWeek) {
        dispatch({
          type: PREGNANCY_ACTIONS.ACHIEVE_MILESTONE,
          payload: { ...milestone, achievedDate: new Date().toISOString() }
        });
      }
    });
  };

  // Get default week data for weeks not in our data
  const getDefaultWeekData = (week) => {
    const trimester = week <= 12 ? 1 : week <= 27 ? 2 : 3;
    return {
      babySize: 'Growing',
      sizeInches: 'N/A',
      developmentMilestones: [`Week ${week} development continues`],
      maternalChanges: [`Trimester ${trimester} changes`],
      tipsAndAdvice: ['Continue healthy habits', 'Stay hydrated', 'Get plenty of rest']
    };
  };

  // Local storage functions
  const savePregnancyData = () => {
    try {
      localStorage.setItem('bloomtrack_pregnancy_state', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving pregnancy data:', error);
    }
  };

  const loadPregnancyData = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_pregnancy_state');
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Restore state with saved data
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key]) {
            dispatch({
              type: `SET_${key.toUpperCase()}`,
              payload: parsedData[key]
            });
          }
        });
      }
    } catch (error) {
      console.error('Error loading pregnancy data:', error);
    }
  };

  // Action creators
  const actions = {
    // Symptoms
    addSymptom: (symptom) => {
      dispatch({
        type: PREGNANCY_ACTIONS.ADD_SYMPTOM,
        payload: { ...symptom, id: Date.now().toString() }
      });
    },

    updateSymptom: (id, updates) => {
      dispatch({
        type: PREGNANCY_ACTIONS.UPDATE_SYMPTOM,
        payload: { id, updates }
      });
    },

    removeSymptom: (id) => {
      dispatch({
        type: PREGNANCY_ACTIONS.REMOVE_SYMPTOM,
        payload: id
      });
    },

    // Appointments
    addAppointment: (appointment) => {
      dispatch({
        type: PREGNANCY_ACTIONS.ADD_APPOINTMENT,
        payload: { ...appointment, id: Date.now().toString() }
      });
    },

    completeAppointment: (id) => {
      dispatch({
        type: PREGNANCY_ACTIONS.COMPLETE_APPOINTMENT,
        payload: id
      });
    },

    // Milestones
    achieveMilestone: (milestone) => {
      dispatch({
        type: PREGNANCY_ACTIONS.ACHIEVE_MILESTONE,
        payload: { ...milestone, achievedDate: new Date().toISOString() }
      });
    },

    addCustomMilestone: (milestone) => {
      dispatch({
        type: PREGNANCY_ACTIONS.ADD_CUSTOM_MILESTONE,
        payload: { ...milestone, id: Date.now().toString(), custom: true }
      });
    },

    // Health tracking
    addWeightEntry: (weight, date = new Date()) => {
      dispatch({
        type: PREGNANCY_ACTIONS.ADD_WEIGHT_ENTRY,
        payload: { weight, date: date.toISOString(), id: Date.now().toString() }
      });
    },

    addHealthMeasurement: (type, data) => {
      dispatch({
        type: PREGNANCY_ACTIONS.ADD_HEALTH_MEASUREMENT,
        payload: { type, data: { ...data, id: Date.now().toString(), date: new Date().toISOString() } }
      });
    },

    // Preferences
    updatePreferences: (preferences) => {
      dispatch({
        type: PREGNANCY_ACTIONS.UPDATE_PREFERENCES,
        payload: preferences
      });
    }
  };

  // Enhanced computed values using pregnancy calculations
  const computedValues = {
    // Basic week information
    currentWeekInfo: state.weeklyInfo.currentWeekData,
    currentWeek: pregnancyData?.currentWeek || (pregnancyData?.lastMenstrualPeriod ? calculateCurrentWeek(new Date(pregnancyData.lastMenstrualPeriod)) : 1),
    currentTrimester: getCurrentTrimester(pregnancyData?.currentWeek || 1),
    trimesterInfo: getTrimesterInfo(getCurrentTrimester(pregnancyData?.currentWeek || 1)),
    
    // Due date calculations
    dueDate: pregnancyData?.dueDate || (pregnancyData?.lastMenstrualPeriod ? calculateDueDate(new Date(pregnancyData.lastMenstrualPeriod)) : null),
    daysRemaining: pregnancyData?.dueDate ? calculateDaysRemaining(new Date(pregnancyData.dueDate)) : null,
    isOverdue: pregnancyData?.dueDate ? isOverdue(new Date(pregnancyData.dueDate)) : false,
    isFullTerm: isFullTerm(pregnancyData?.currentWeek || 1),
    
    // Progress calculations
    pregnancyProgress: calculatePregnancyProgress(pregnancyData?.currentWeek || 1),
    trimesterProgress: {
      1: calculateTrimesterProgress(pregnancyData?.currentWeek || 1, 1),
      2: calculateTrimesterProgress(pregnancyData?.currentWeek || 1, 2),
      3: calculateTrimesterProgress(pregnancyData?.currentWeek || 1, 3),
      current: calculateTrimesterProgress(pregnancyData?.currentWeek || 1, getCurrentTrimester(pregnancyData?.currentWeek || 1))
    },
    
    // Baby development
    babyWeight: estimateBabyWeight(pregnancyData?.currentWeek || 1),
    babyLength: estimateBabyLength(pregnancyData?.currentWeek || 1),
    
    // Milestones
    nextMilestone: DEFAULT_MILESTONES.find(m => 
      m.week > (pregnancyData?.currentWeek || 1) && !state.milestones.achieved.find(a => a.id === m.id)
    ),
    milestoneProgress: (state.milestones.achieved.length / DEFAULT_MILESTONES.length) * 100,
    pregnancyMilestones: getPregnancyMilestones(),
    
    // Health and symptoms
    recentSymptoms: state.symptoms.current.slice(-5),
    nextAppointment: state.appointments.upcoming[0],
    
    // Validation
    dataValidation: pregnancyData?.lastMenstrualPeriod ? validatePregnancyData(new Date(pregnancyData.lastMenstrualPeriod)) : { isValid: false, errors: ['LMP date required'] }
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computedValues,
    
    // Utility functions
    getWeekData: (week) => WEEKLY_DEVELOPMENT_DATA[week] || getDefaultWeekData(week),
    getAllMilestones: () => [...DEFAULT_MILESTONES, ...state.milestones.custom],
    
    // Enhanced calculation functions
    calculateCurrentWeek: (lmpDate) => calculateCurrentWeek(lmpDate),
    calculateDueDate: (lmpDate) => calculateDueDate(lmpDate),
    calculateDaysRemaining: (dueDate) => calculateDaysRemaining(dueDate),
    getTrimesterInfo: (trimester) => getTrimesterInfo(trimester),
    validatePregnancyData: (lmpDate) => validatePregnancyData(lmpDate),
    
    // Pregnancy status helpers
    getPregnancyStatus: () => {
      const currentWeek = pregnancyData?.currentWeek || 1;
      if (!currentWeek) return 'Not set';
      if (computedValues.isOverdue) return 'Overdue';
      if (computedValues.isFullTerm) return 'Full term';
      if (currentWeek >= 24) return 'Viable';
      if (currentWeek >= 13) return 'Second trimester';
      return 'First trimester';
    },
    
    getWeeksSummary: () => {
      const week = pregnancyData?.currentWeek || 1;
      const trimester = getCurrentTrimester(week);
      const remaining = 40 - week;
      return {
        current: week,
        remaining: Math.max(0, remaining),
        trimester,
        percentage: Math.round((week / 40) * 100)
      };
    }
  };

  return (
    <PregnancyContext.Provider value={contextValue}>
      {children}
    </PregnancyContext.Provider>
  );
}

// Custom hook to use PregnancyContext
export function usePregnancy() {
  const context = useContext(PregnancyContext);
  
  if (!context) {
    throw new Error('usePregnancy must be used within a PregnancyProvider');
  }
  
  return context;
}

// Export action types and default data
export { PREGNANCY_ACTIONS, DEFAULT_MILESTONES, WEEKLY_DEVELOPMENT_DATA };