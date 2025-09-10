import { createContext, useContext, useReducer, useEffect } from 'react';
import { useApp } from './AppContext';

// Create the context
const CalendarContext = createContext();

// Initial state
const initialState = {
  // Calendar view settings
  view: {
    currentView: 'month', // month, week, day
    selectedDate: new Date().toISOString().split('T')[0],
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear()
  },

  // Events and appointments
  events: {
    appointments: [],
    milestones: [],
    reminders: [],
    personalEvents: []
  },

  // Daily mood tracking
  moods: {
    daily: [], // Array of { date, mood, energy, symptoms, notes }
    patterns: {},
    averages: {}
  },

  // Reminders and notifications
  reminders: {
    prenatalVitamins: { enabled: true, time: '09:00' },
    waterIntake: { enabled: true, frequency: 2 }, // hours
    moodCheck: { enabled: true, time: '20:00' },
    appointments: { enabled: true, advance: 24 }, // hours
    exercise: { enabled: false, time: '08:00' }
  },

  // Calendar preferences
  preferences: {
    weekStartsOn: 0, // 0 = Sunday, 1 = Monday
    timeFormat: '12h', // 12h or 24h
    showWeekNumbers: false,
    highlightWeekends: true,
    moodColors: true
  }
};

// Action types
const CALENDAR_ACTIONS = {
  // View actions
  SET_VIEW: 'SET_VIEW',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  NAVIGATE_MONTH: 'NAVIGATE_MONTH',
  GO_TO_TODAY: 'GO_TO_TODAY',

  // Event actions
  ADD_EVENT: 'ADD_EVENT',
  UPDATE_EVENT: 'UPDATE_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
  
  // Appointment actions
  ADD_APPOINTMENT: 'ADD_APPOINTMENT',
  UPDATE_APPOINTMENT: 'UPDATE_APPOINTMENT',
  COMPLETE_APPOINTMENT: 'COMPLETE_APPOINTMENT',

  // Mood tracking
  SET_DAILY_MOOD: 'SET_DAILY_MOOD',
  UPDATE_MOOD_ENTRY: 'UPDATE_MOOD_ENTRY',
  CALCULATE_MOOD_PATTERNS: 'CALCULATE_MOOD_PATTERNS',

  // Reminders
  UPDATE_REMINDER_SETTINGS: 'UPDATE_REMINDER_SETTINGS',
  TOGGLE_REMINDER: 'TOGGLE_REMINDER',

  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
};

// Mood options with colors
const MOOD_OPTIONS = {
  excellent: { 
    label: 'Excellent', 
    emoji: '😄', 
    color: '#A8D8A8', 
    value: 5 
  },
  good: { 
    label: 'Good', 
    emoji: '😊', 
    color: '#C8A8E9', 
    value: 4 
  },
  okay: { 
    label: 'Okay', 
    emoji: '😐', 
    color: '#FFB5A7', 
    value: 3 
  },
  low: { 
    label: 'Low', 
    emoji: '😔', 
    color: '#F4A261', 
    value: 2 
  },
  difficult: { 
    label: 'Difficult', 
    emoji: '😰', 
    color: '#E76F51', 
    value: 1 
  }
};

// Energy levels
const ENERGY_LEVELS = {
  high: { label: 'High Energy', emoji: '⚡', value: 3 },
  medium: { label: 'Medium Energy', emoji: '🔋', value: 2 },
  low: { label: 'Low Energy', emoji: '😴', value: 1 }
};

// Common pregnancy symptoms for quick selection
const COMMON_SYMPTOMS = [
  'Morning sickness',
  'Nausea',
  'Fatigue',
  'Heartburn',
  'Back pain',
  'Headache',
  'Mood swings',
  'Emotional',
  'Food cravings',
  'Constipation',
  'Frequent urination',
  'Breast tenderness',
  'Leg cramps',
  'Insomnia'
];

// Reducer function
function calendarReducer(state, action) {
  switch (action.type) {
    case CALENDAR_ACTIONS.SET_VIEW:
      return {
        ...state,
        view: { ...state.view, currentView: action.payload }
      };

    case CALENDAR_ACTIONS.SET_SELECTED_DATE:
      return {
        ...state,
        view: { ...state.view, selectedDate: action.payload }
      };

    case CALENDAR_ACTIONS.NAVIGATE_MONTH:
      const { direction } = action.payload;
      const currentDate = new Date(state.view.currentYear, state.view.currentMonth);
      const newDate = new Date(currentDate.setMonth(currentDate.getMonth() + direction));
      
      return {
        ...state,
        view: {
          ...state.view,
          currentMonth: newDate.getMonth(),
          currentYear: newDate.getFullYear()
        }
      };

    case CALENDAR_ACTIONS.GO_TO_TODAY:
      const today = new Date();
      return {
        ...state,
        view: {
          ...state.view,
          selectedDate: today.toISOString().split('T')[0],
          currentMonth: today.getMonth(),
          currentYear: today.getFullYear()
        }
      };

    case CALENDAR_ACTIONS.ADD_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.type]: [...state.events[action.payload.type], action.payload.event]
        }
      };

    case CALENDAR_ACTIONS.UPDATE_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.type]: state.events[action.payload.type].map(event =>
            event.id === action.payload.id ? { ...event, ...action.payload.updates } : event
          )
        }
      };

    case CALENDAR_ACTIONS.DELETE_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          [action.payload.type]: state.events[action.payload.type].filter(
            event => event.id !== action.payload.id
          )
        }
      };

    case CALENDAR_ACTIONS.ADD_APPOINTMENT:
      const newAppointment = {
        ...action.payload,
        id: Date.now().toString(),
        type: 'appointment',
        createdAt: new Date().toISOString()
      };
      
      return {
        ...state,
        events: {
          ...state.events,
          appointments: [...state.events.appointments, newAppointment].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
        }
      };

    case CALENDAR_ACTIONS.SET_DAILY_MOOD:
      const existingMoodIndex = state.moods.daily.findIndex(
        mood => mood.date === action.payload.date
      );

      let updatedMoods;
      if (existingMoodIndex >= 0) {
        // Update existing mood entry
        updatedMoods = state.moods.daily.map((mood, index) =>
          index === existingMoodIndex ? { ...mood, ...action.payload } : mood
        );
      } else {
        // Add new mood entry
        updatedMoods = [...state.moods.daily, action.payload].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      }

      return {
        ...state,
        moods: {
          ...state.moods,
          daily: updatedMoods
        }
      };

    case CALENDAR_ACTIONS.UPDATE_MOOD_ENTRY:
      return {
        ...state,
        moods: {
          ...state.moods,
          daily: state.moods.daily.map(mood =>
            mood.date === action.payload.date ? { ...mood, ...action.payload.updates } : mood
          )
        }
      };

    case CALENDAR_ACTIONS.CALCULATE_MOOD_PATTERNS:
      const patterns = calculateMoodPatterns(state.moods.daily);
      return {
        ...state,
        moods: {
          ...state.moods,
          patterns: patterns.patterns,
          averages: patterns.averages
        }
      };

    case CALENDAR_ACTIONS.UPDATE_REMINDER_SETTINGS:
      return {
        ...state,
        reminders: {
          ...state.reminders,
          [action.payload.type]: { ...state.reminders[action.payload.type], ...action.payload.settings }
        }
      };

    case CALENDAR_ACTIONS.TOGGLE_REMINDER:
      return {
        ...state,
        reminders: {
          ...state.reminders,
          [action.payload]: { 
            ...state.reminders[action.payload], 
            enabled: !state.reminders[action.payload].enabled 
          }
        }
      };

    case CALENDAR_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    default:
      return state;
  }
}

// Helper function to calculate mood patterns
function calculateMoodPatterns(dailyMoods) {
  if (dailyMoods.length === 0) {
    return { patterns: {}, averages: {} };
  }

  // Calculate weekly averages
  const weeklyData = {};
  const monthlyData = {};
  
  dailyMoods.forEach(entry => {
    const date = new Date(entry.date);
    const weekKey = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    
    if (!weeklyData[weekKey]) weeklyData[weekKey] = [];
    if (!monthlyData[monthKey]) monthlyData[monthKey] = [];
    
    weeklyData[weekKey].push(entry.mood);
    monthlyData[monthKey].push(entry.mood);
  });

  // Calculate averages
  const weeklyAverages = {};
  const monthlyAverages = {};
  
  Object.keys(weeklyData).forEach(week => {
    const moodValues = weeklyData[week].map(mood => MOOD_OPTIONS[mood]?.value || 3);
    weeklyAverages[week] = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  });
  
  Object.keys(monthlyData).forEach(month => {
    const moodValues = monthlyData[month].map(mood => MOOD_OPTIONS[mood]?.value || 3);
    monthlyAverages[month] = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
  });

  return {
    patterns: {
      weekly: weeklyAverages,
      monthly: monthlyAverages
    },
    averages: {
      overall: dailyMoods.reduce((acc, entry) => acc + (MOOD_OPTIONS[entry.mood]?.value || 3), 0) / dailyMoods.length,
      lastWeek: calculateRecentAverage(dailyMoods, 7),
      lastMonth: calculateRecentAverage(dailyMoods, 30)
    }
  };
}

// Helper function to get week number
function getWeekNumber(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + days) / 7);
}

// Helper function to calculate recent averages
function calculateRecentAverage(dailyMoods, days) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const recentMoods = dailyMoods.filter(entry => new Date(entry.date) >= cutoffDate);
  
  if (recentMoods.length === 0) return 0;
  
  const total = recentMoods.reduce((acc, entry) => acc + (MOOD_OPTIONS[entry.mood]?.value || 3), 0);
  return total / recentMoods.length;
}

// CalendarProvider component
export function CalendarProvider({ children }) {
  const [state, dispatch] = useReducer(calendarReducer, initialState);
  const { pregnancyData } = useApp();

  // Load persisted data on mount
  useEffect(() => {
    loadCalendarData();
  }, []);

  // Save data when state changes
  useEffect(() => {
    saveCalendarData();
  }, [state]);

  // Recalculate mood patterns when daily moods change
  useEffect(() => {
    if (state.moods.daily.length > 0) {
      dispatch({ type: CALENDAR_ACTIONS.CALCULATE_MOOD_PATTERNS });
    }
  }, [state.moods.daily]);

  // Local storage functions
  const saveCalendarData = () => {
    try {
      localStorage.setItem('bloomtrack_calendar_data', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving calendar data:', error);
    }
  };

  const loadCalendarData = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_calendar_data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        // Restore each piece of state
        if (parsedData.events) {
          Object.keys(parsedData.events).forEach(eventType => {
            parsedData.events[eventType].forEach(event => {
              dispatch({
                type: CALENDAR_ACTIONS.ADD_EVENT,
                payload: { type: eventType, event }
              });
            });
          });
        }
        
        if (parsedData.moods?.daily) {
          parsedData.moods.daily.forEach(mood => {
            dispatch({
              type: CALENDAR_ACTIONS.SET_DAILY_MOOD,
              payload: mood
            });
          });
        }

        if (parsedData.preferences) {
          dispatch({
            type: CALENDAR_ACTIONS.UPDATE_PREFERENCES,
            payload: parsedData.preferences
          });
        }
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  };

  // Action creators
  const actions = {
    // View actions
    setView: (view) => {
      dispatch({ type: CALENDAR_ACTIONS.SET_VIEW, payload: view });
    },

    setSelectedDate: (date) => {
      dispatch({ type: CALENDAR_ACTIONS.SET_SELECTED_DATE, payload: date });
    },

    navigateMonth: (direction) => {
      dispatch({ type: CALENDAR_ACTIONS.NAVIGATE_MONTH, payload: { direction } });
    },

    goToToday: () => {
      dispatch({ type: CALENDAR_ACTIONS.GO_TO_TODAY });
    },

    // Event actions
    addEvent: (eventType, eventData) => {
      const event = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      dispatch({
        type: CALENDAR_ACTIONS.ADD_EVENT,
        payload: { type: eventType, event }
      });
    },

    updateEvent: (eventType, id, updates) => {
      dispatch({
        type: CALENDAR_ACTIONS.UPDATE_EVENT,
        payload: { type: eventType, id, updates }
      });
    },

    deleteEvent: (eventType, id) => {
      dispatch({
        type: CALENDAR_ACTIONS.DELETE_EVENT,
        payload: { type: eventType, id }
      });
    },

    // Appointment actions
    addAppointment: (appointmentData) => {
      dispatch({
        type: CALENDAR_ACTIONS.ADD_APPOINTMENT,
        payload: appointmentData
      });
    },

    // Mood tracking
    setDailyMood: (date, moodData) => {
      const moodEntry = {
        date,
        ...moodData,
        timestamp: new Date().toISOString()
      };
      dispatch({
        type: CALENDAR_ACTIONS.SET_DAILY_MOOD,
        payload: moodEntry
      });
    },

    updateMoodEntry: (date, updates) => {
      dispatch({
        type: CALENDAR_ACTIONS.UPDATE_MOOD_ENTRY,
        payload: { date, updates }
      });
    },

    // Quick mood actions
    setQuickMood: (mood, energy = 'medium', symptoms = [], notes = '') => {
      const today = new Date().toISOString().split('T')[0];
      actions.setDailyMood(today, { mood, energy, symptoms, notes });
    },

    // Reminder actions
    updateReminderSettings: (type, settings) => {
      dispatch({
        type: CALENDAR_ACTIONS.UPDATE_REMINDER_SETTINGS,
        payload: { type, settings }
      });
    },

    toggleReminder: (type) => {
      dispatch({
        type: CALENDAR_ACTIONS.TOGGLE_REMINDER,
        payload: type
      });
    },

    // Preferences
    updatePreferences: (preferences) => {
      dispatch({
        type: CALENDAR_ACTIONS.UPDATE_PREFERENCES,
        payload: preferences
      });
    }
  };

  // Computed values
  const computedValues = {
    // Get events for a specific date
    getEventsForDate: (date) => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      return {
        appointments: state.events.appointments.filter(apt => apt.date === dateStr),
        milestones: state.events.milestones.filter(ms => ms.date === dateStr),
        reminders: state.events.reminders.filter(rem => rem.date === dateStr),
        personalEvents: state.events.personalEvents.filter(evt => evt.date === dateStr)
      };
    },

    // Get mood for specific date
    getMoodForDate: (date) => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      return state.moods.daily.find(mood => mood.date === dateStr);
    },

    // Get upcoming appointments
    getUpcomingAppointments: (limit = 5) => {
      const today = new Date().toISOString().split('T')[0];
      return state.events.appointments
        .filter(apt => apt.date >= today)
        .slice(0, limit);
    },

    // Calendar display helpers
    getCalendarDays: () => {
      const year = state.view.currentYear;
      const month = state.view.currentMonth;
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() - firstDay.getDay() + state.preferences.weekStartsOn);
      
      const days = [];
      const currentDate = new Date(startDate);
      
      for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
        const dateStr = currentDate.toISOString().split('T')[0];
        const mood = computedValues.getMoodForDate(dateStr);
        const events = computedValues.getEventsForDate(dateStr);
        
        days.push({
          date: new Date(currentDate),
          dateStr,
          isCurrentMonth: currentDate.getMonth() === month,
          isToday: dateStr === new Date().toISOString().split('T')[0],
          isSelected: dateStr === state.view.selectedDate,
          mood: mood?.mood,
          moodColor: mood ? MOOD_OPTIONS[mood.mood]?.color : null,
          hasEvents: Object.values(events).some(eventArray => eventArray.length > 0),
          eventCount: Object.values(events).reduce((total, eventArray) => total + eventArray.length, 0)
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return days;
    },

    // Mood statistics
    moodStats: {
      currentStreak: calculateMoodStreak(state.moods.daily),
      totalEntries: state.moods.daily.length,
      averageThisWeek: state.moods.averages?.lastWeek || 0,
      averageThisMonth: state.moods.averages?.lastMonth || 0,
      mostCommonMood: getMostCommonMood(state.moods.daily)
    }
  };

  // Helper functions for mood statistics
  function calculateMoodStreak(dailyMoods) {
    if (dailyMoods.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const currentDate = new Date(today);
    
    while (streak < dailyMoods.length) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const moodEntry = dailyMoods.find(mood => mood.date === dateStr);
      
      if (moodEntry) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  }

  function getMostCommonMood(dailyMoods) {
    if (dailyMoods.length === 0) return null;
    
    const moodCounts = {};
    dailyMoods.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    return Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
  }

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computedValues,
    
    // Constants
    MOOD_OPTIONS,
    ENERGY_LEVELS,
    COMMON_SYMPTOMS
  };

  return (
    <CalendarContext.Provider value={contextValue}>
      {children}
    </CalendarContext.Provider>
  );
}

// Custom hook to use CalendarContext
export function useCalendar() {
  const context = useContext(CalendarContext);
  
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  
  return context;
}

// Export action types and constants
export { CALENDAR_ACTIONS, MOOD_OPTIONS, ENERGY_LEVELS, COMMON_SYMPTOMS };