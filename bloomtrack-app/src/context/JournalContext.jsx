import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useApp } from './AppContext';
import { useCalendar } from './CalendarContext';

// Create the context
const JournalContext = createContext();

// Initial state
const initialState = {
  // Journal entries
  entries: {
    daily: [], // Daily journal entries
    weekly: [], // Weekly reflection summaries
    milestone: [], // Milestone-specific reflections
    gratitude: [], // Daily gratitude entries
    fears: [], // Fears and concerns to process
    hopes: [], // Hopes and dreams entries
    letters: [] // Letters to baby
  },

  // Entry templates and prompts
  prompts: {
    daily: [],
    weekly: [],
    gratitude: [],
    reflection: [],
    milestone: []
  },

  // Search and filtering
  search: {
    query: '',
    filters: {
      dateRange: 'all', // all, week, month, trimester
      entryType: 'all', // all, daily, gratitude, letters, etc.
      mood: 'all', // all, excellent, good, okay, low, difficult
      tags: []
    },
    results: []
  },

  // Writing statistics
  stats: {
    totalEntries: 0,
    totalWords: 0,
    streak: 0,
    longestStreak: 0,
    averageWordsPerEntry: 0,
    entriesThisWeek: 0,
    entriesThisMonth: 0,
    favoritePrompts: [],
    moodTrends: {}
  },

  // Journal preferences
  preferences: {
    dailyReminder: { enabled: true, time: '20:00' },
    weeklyReflection: { enabled: true, day: 'sunday' },
    prompts: { enabled: true, frequency: 'daily' },
    privacy: 'private', // private, partner, family
    exportFormat: 'pdf', // pdf, txt, json
    fontSize: 'medium', // small, medium, large
    theme: 'warm' // warm, minimal, colorful
  },

  // Sharing and support
  sharing: {
    sharedEntries: [], // Entries shared with partner/care team
    supportRequests: [], // Requests for support/advice
    encouragementMessages: [], // Messages from community
    privateNotes: [] // Always private notes
  }
};

// Journal entry types with styling
const ENTRY_TYPES = {
  daily: {
    label: 'Daily Entry',
    icon: '📝',
    color: '#F4A6CD',
    description: 'Daily thoughts and feelings'
  },
  gratitude: {
    label: 'Gratitude',
    icon: '🙏',
    color: '#A8D8A8',
    description: 'Things you\'re grateful for'
  },
  fears: {
    label: 'Fears & Concerns',
    icon: '😰',
    color: '#F4A261',
    description: 'Processing worries and fears'
  },
  hopes: {
    label: 'Hopes & Dreams',
    icon: '🌟',
    color: '#C8A8E9',
    description: 'Future hopes and dreams'
  },
  letters: {
    label: 'Letters to Baby',
    icon: '💌',
    color: '#FFB5A7',
    description: 'Personal letters to your baby'
  },
  milestone: {
    label: 'Milestone Reflection',
    icon: '🎯',
    color: '#E8B4B8',
    description: 'Reflecting on special moments'
  },
  weekly: {
    label: 'Weekly Summary',
    icon: '📊',
    color: '#B5E7A0',
    description: 'Week in review'
  }
};

// Daily journal prompts by trimester
const JOURNAL_PROMPTS = {
  daily: {
    trimester1: [
      "How am I feeling about this pregnancy today?",
      "What changes am I noticing in my body?",
      "What am I most excited about right now?",
      "What questions do I have for my next appointment?",
      "How is my partner handling the pregnancy?",
      "What am I doing to take care of myself today?",
      "What symptoms am I experiencing?",
      "How has my mood been today?",
      "What am I learning about being pregnant?",
      "What support do I need right now?"
    ],
    trimester2: [
      "How do I feel about my changing body?",
      "What movements have I felt from baby?",
      "How am I preparing for baby's arrival?",
      "What am I most looking forward to?",
      "How is my relationship with my partner changing?",
      "What fears do I have about parenthood?",
      "How am I connecting with my baby?",
      "What have I learned this week?",
      "How am I taking care of my mental health?",
      "What am I grateful for today?"
    ],
    trimester3: [
      "How ready do I feel for baby's arrival?",
      "What am I most nervous about?",
      "How have I grown during this pregnancy?",
      "What do I want to remember about this time?",
      "How am I preparing emotionally for birth?",
      "What kind of parent do I want to be?",
      "How has this pregnancy changed me?",
      "What am I most excited to share with baby?",
      "How am I feeling about labor and delivery?",
      "What legacy do I want to leave for my child?"
    ]
  },
  gratitude: [
    "What made me smile today?",
    "Who supported me today?",
    "What am I grateful for about my body?",
    "What small miracle happened today?",
    "What am I thankful for about this pregnancy?",
    "Who has shown me love recently?",
    "What comfort did I find today?",
    "What strength did I discover in myself?",
    "What beauty did I notice today?",
    "What hope am I holding onto?"
  ],
  weekly: [
    "How has this week shaped my pregnancy journey?",
    "What did I learn about myself this week?",
    "How did I grow as a person this week?",
    "What challenges did I overcome?",
    "What moments brought me the most joy?",
    "How did I connect with my baby this week?",
    "What am I most proud of from this week?",
    "How did others support me this week?",
    "What am I looking forward to next week?",
    "What wisdom would I share with other pregnant women?"
  ]
};

// Action types
const JOURNAL_ACTIONS = {
  // Entry management
  ADD_ENTRY: 'ADD_ENTRY',
  UPDATE_ENTRY: 'UPDATE_ENTRY',
  DELETE_ENTRY: 'DELETE_ENTRY',
  LOAD_DATA: 'LOAD_DATA',
  
  // Search and filtering
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_FILTERS: 'SET_SEARCH_FILTERS',
  PERFORM_SEARCH: 'PERFORM_SEARCH',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // Statistics
  CALCULATE_STATS: 'CALCULATE_STATS',
  UPDATE_STREAK: 'UPDATE_STREAK',
  
  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  
  // Sharing
  SHARE_ENTRY: 'SHARE_ENTRY',
  ADD_SUPPORT_REQUEST: 'ADD_SUPPORT_REQUEST',
  ADD_ENCOURAGEMENT: 'ADD_ENCOURAGEMENT',
  
  // Prompts
  GET_DAILY_PROMPT: 'GET_DAILY_PROMPT',
  MARK_PROMPT_USED: 'MARK_PROMPT_USED'
};

// Reducer function
function journalReducer(state, action) {
  switch (action.type) {
    case JOURNAL_ACTIONS.ADD_ENTRY:
      console.log('ADD_ENTRY reducer called with payload:', action.payload);
      const newEntry = {
        id: `entry-${Date.now()}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: countWords(action.payload.content || ''),
        readingTime: calculateReadingTime(action.payload.content || '')
      };
      
      console.log('ADD_ENTRY: Creating new entry:', newEntry);
      console.log('Current state.entries:', state.entries);
      console.log('Entry type:', action.payload.type);

      const newState = {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.type]: [...state.entries[action.payload.type], newEntry].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        }
      };
      
      console.log('New state after ADD_ENTRY:', newState);
      return newState;

    case JOURNAL_ACTIONS.LOAD_DATA:
      return {
        ...state,
        entries: action.payload.entries || state.entries
      };

    case JOURNAL_ACTIONS.UPDATE_ENTRY:
      const { entryId, entryType, updates } = action.payload;
      
      return {
        ...state,
        entries: {
          ...state.entries,
          [entryType]: state.entries[entryType].map(entry =>
            entry.id === entryId ? {
              ...entry,
              ...updates,
              updatedAt: new Date().toISOString(),
              wordCount: countWords(updates.content || entry.content || ''),
              readingTime: calculateReadingTime(updates.content || entry.content || '')
            } : entry
          )
        }
      };

    case JOURNAL_ACTIONS.DELETE_ENTRY:
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.entryType]: state.entries[action.payload.entryType].filter(
            entry => entry.id !== action.payload.entryId
          )
        }
      };

    case JOURNAL_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        search: { ...state.search, query: action.payload }
      };

    case JOURNAL_ACTIONS.SET_SEARCH_FILTERS:
      return {
        ...state,
        search: { ...state.search, filters: { ...state.search.filters, ...action.payload } }
      };

    case JOURNAL_ACTIONS.PERFORM_SEARCH:
      const searchResults = performSearch(state.entries, state.search.query, state.search.filters);
      return {
        ...state,
        search: { ...state.search, results: searchResults }
      };

    case JOURNAL_ACTIONS.CLEAR_SEARCH:
      return {
        ...state,
        search: { ...state.search, query: '', results: [] }
      };

    case JOURNAL_ACTIONS.CALCULATE_STATS:
      const stats = calculateJournalStats(state.entries);
      return {
        ...state,
        stats: { ...state.stats, ...stats }
      };

    case JOURNAL_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case JOURNAL_ACTIONS.SHARE_ENTRY:
      return {
        ...state,
        sharing: {
          ...state.sharing,
          sharedEntries: [...state.sharing.sharedEntries, action.payload]
        }
      };

    case JOURNAL_ACTIONS.ADD_ENCOURAGEMENT:
      return {
        ...state,
        sharing: {
          ...state.sharing,
          encouragementMessages: [...state.sharing.encouragementMessages, action.payload]
        }
      };

    default:
      return state;
  }
}

// Helper functions
function countWords(text) {
  if (!text) return 0;
  
  // If text contains HTML tags, extract plain text first
  if (text.includes('<')) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
  }
  
  // Handle plain text normally
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = countWords(text);
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

function performSearch(entries, query, filters) {
  const allEntries = Object.values(entries).flat();
  
  let results = allEntries.filter(entry => {
    // Text search
    const matchesQuery = !query || 
      entry.title?.toLowerCase().includes(query.toLowerCase()) ||
      entry.content?.toLowerCase().includes(query.toLowerCase()) ||
      entry.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

    // Type filter
    const matchesType = filters.entryType === 'all' || entry.type === filters.entryType;

    // Mood filter
    const matchesMood = filters.mood === 'all' || entry.mood === filters.mood;

    // Date range filter
    const matchesDateRange = checkDateRange(entry.date, filters.dateRange);

    return matchesQuery && matchesType && matchesMood && matchesDateRange;
  });

  return results.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function checkDateRange(entryDate, range) {
  const today = new Date();
  const entryDateObj = new Date(entryDate);

  switch (range) {
    case 'week':
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return entryDateObj >= weekAgo;
    case 'month':
      const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      return entryDateObj >= monthAgo;
    case 'trimester':
      const trimesterAgo = new Date(today.getTime() - 13 * 7 * 24 * 60 * 60 * 1000);
      return entryDateObj >= trimesterAgo;
    default:
      return true;
  }
}

function calculateJournalStats(entries) {
  const allEntries = Object.values(entries).flat();
  
  if (allEntries.length === 0) {
    return {
      totalEntries: 0,
      totalWords: 0,
      streak: 0,
      averageWordsPerEntry: 0,
      entriesThisWeek: 0,
      entriesThisMonth: 0
    };
  }

  const totalWords = allEntries.reduce((sum, entry) => sum + (entry.wordCount || 0), 0);
  const averageWordsPerEntry = Math.round(totalWords / allEntries.length);

  // Calculate current streak
  const sortedEntries = allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let currentDate = new Date();
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    const diffInDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= streak + 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }

  // Calculate recent entries
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const entriesThisWeek = allEntries.filter(entry => new Date(entry.date) >= weekAgo).length;
  const entriesThisMonth = allEntries.filter(entry => new Date(entry.date) >= monthAgo).length;

  return {
    totalEntries: allEntries.length,
    totalWords,
    streak,
    averageWordsPerEntry,
    entriesThisWeek,
    entriesThisMonth
  };
}

// JournalProvider component
export function JournalProvider({ children }) {
  const [state, dispatch] = useReducer(journalReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);
  const { pregnancyData } = useApp();
  const { getMoodForDate } = useCalendar();

  // Load persisted data on mount
  useEffect(() => {
    loadJournalData();
  }, []);

  // Save data when state changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      console.log('useEffect triggered - state.entries changed:', state.entries);
      saveJournalData();
    }
  }, [state.entries, state.preferences, isInitialized]);

  // Recalculate stats when entries change
  useEffect(() => {
    dispatch({ type: JOURNAL_ACTIONS.CALCULATE_STATS });
  }, [state.entries]);

  // Local storage functions
  const saveJournalData = () => {
    try {
      const dataToSave = {
        entries: state.entries,
        preferences: state.preferences,
        sharing: state.sharing
      };
      console.log('Saving journal data to localStorage:', dataToSave);
      localStorage.setItem('bloomtrack_journal_data', JSON.stringify(dataToSave));
      console.log('Journal data saved successfully');
    } catch (error) {
      console.error('Error saving journal data:', error);
    }
  };

  const loadJournalData = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_journal_data');
      console.log('Loading journal data from localStorage:', saved);
      if (saved) {
        const parsedData = JSON.parse(saved);
        console.log('Parsed journal data:', parsedData);
        
        // Restore entries directly to state
        if (parsedData.entries) {
          console.log('Dispatching LOAD_DATA with entries:', parsedData.entries);
          dispatch({
            type: JOURNAL_ACTIONS.LOAD_DATA,
            payload: { entries: parsedData.entries }
          });
        }

        // Restore preferences
        if (parsedData.preferences) {
          dispatch({
            type: JOURNAL_ACTIONS.UPDATE_PREFERENCES,
            payload: parsedData.preferences
          });
        }
      } else {
        console.log('No journal data found in localStorage');
      }
    } catch (error) {
      console.error('Error loading journal data:', error);
    } finally {
      // Always set initialized to true after attempting to load
      setIsInitialized(true);
    }
  };

  // Core add entry function
  const addEntry = (entryType, entryData) => {
    console.log('addEntry called with:', { entryType, entryData });
    const entry = {
      type: entryType,
      ...entryData
    };

    console.log('About to dispatch ADD_ENTRY with:', entry);
    dispatch({
      type: JOURNAL_ACTIONS.ADD_ENTRY,
      payload: entry
    });

    console.log('Entry dispatched successfully');
    return entry; // Return the entry so we can get word count externally
  };

  // Action creators
  const actions = {
    // Entry management
    addEntry,

    updateEntry: (entryId, entryType, updates) => {
      dispatch({
        type: JOURNAL_ACTIONS.UPDATE_ENTRY,
        payload: { entryId, entryType, updates }
      });
    },

    deleteEntry: (entryId, entryType) => {
      dispatch({
        type: JOURNAL_ACTIONS.DELETE_ENTRY,
        payload: { entryId, entryType }
      });
    },

    // Quick entry creators
    addDailyEntry: (title, content, mood, tags = []) => {
      const today = new Date().toISOString().split('T')[0];
      const moodData = getMoodForDate(today);
      
      return addEntry('daily', {
        title,
        content,
        mood: mood || moodData?.mood || 'okay',
        tags,
        week: pregnancyData.currentWeek,
        trimester: pregnancyData.trimester
      });
    },

    addGratitudeEntry: (gratitudeItems, notes = '') => {
      return addEntry('gratitude', {
        title: `Gratitude - ${new Date().toLocaleDateString()}`,
        content: notes,
        gratitudeItems,
        mood: 'good'
      });
    },

    addLetterToBaby: (title, content) => {
      return addEntry('letters', {
        title,
        content,
        week: pregnancyData.currentWeek,
        mood: 'excellent'
      });
    },

    addFearEntry: (fear, copingStrategy = '') => {
      return addEntry('fears', {
        title: `Processing: ${fear}`,
        content: copingStrategy,
        fear,
        mood: 'low'
      });
    },

    addHopeEntry: (hope, details = '') => {
      return addEntry('hopes', {
        title: `Hope: ${hope}`,
        content: details,
        hope,
        mood: 'excellent'
      });
    },

    // Search functionality
    searchEntries: (query) => {
      dispatch({ type: JOURNAL_ACTIONS.SET_SEARCH_QUERY, payload: query });
      dispatch({ type: JOURNAL_ACTIONS.PERFORM_SEARCH });
    },

    setSearchFilters: (filters) => {
      dispatch({ type: JOURNAL_ACTIONS.SET_SEARCH_FILTERS, payload: filters });
      dispatch({ type: JOURNAL_ACTIONS.PERFORM_SEARCH });
    },

    clearSearch: () => {
      dispatch({ type: JOURNAL_ACTIONS.CLEAR_SEARCH });
    },

    // Preferences
    updatePreferences: (preferences) => {
      dispatch({
        type: JOURNAL_ACTIONS.UPDATE_PREFERENCES,
        payload: preferences
      });
    },

    // Sharing
    shareEntry: (entryId, entryType, audience = 'partner') => {
      dispatch({
        type: JOURNAL_ACTIONS.SHARE_ENTRY,
        payload: {
          entryId,
          entryType,
          audience,
          sharedAt: new Date().toISOString()
        }
      });
    }
  };

  // Get prompts based on current trimester
  const getCurrentPrompts = () => {
    const trimester = pregnancyData.trimester;
    const trimesterKey = `trimester${trimester}`;
    return {
      daily: JOURNAL_PROMPTS.daily[trimesterKey] || JOURNAL_PROMPTS.daily.trimester1,
      gratitude: JOURNAL_PROMPTS.gratitude,
      weekly: JOURNAL_PROMPTS.weekly
    };
  };

  // Get random daily prompt
  const getDailyPrompt = () => {
    const prompts = getCurrentPrompts().daily;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  // Computed values
  const computedValues = {
    // Get all entries in chronological order
    getAllEntries: () => {
      const allEntries = Object.values(state.entries).flat();
      return allEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Get entries by type
    getEntriesByType: (type) => {
      return state.entries[type] || [];
    },

    // Get recent entries
    getRecentEntries: (limit = 5) => {
      return computedValues.getAllEntries().slice(0, limit);
    },

    // Get entries for specific date
    getEntriesForDate: (date) => {
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
      return computedValues.getAllEntries().filter(entry => {
        const entryDate = new Date(entry.createdAt).toISOString().split('T')[0];
        return entryDate === dateStr;
      });
    },

    // Get writing statistics
    getWritingStats: () => {
      return state.stats;
    },

    // Check if user wrote today
    hasWrittenToday: () => {
      const today = new Date().toISOString().split('T')[0];
      return computedValues.getEntriesForDate(today).length > 0;
    },

    // Get mood trends from journal entries
    getMoodTrends: () => {
      const allEntries = computedValues.getAllEntries();
      const moodCounts = {};
      
      allEntries.forEach(entry => {
        if (entry.mood) {
          moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        }
      });

      return moodCounts;
    },

    // Get current prompts
    getCurrentPrompts,
    getDailyPrompt
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    ...computedValues,
    
    // Constants
    ENTRY_TYPES,
    JOURNAL_PROMPTS
  };

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  );
}

// Custom hook to use JournalContext
export function useJournal() {
  const context = useContext(JournalContext);
  
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  
  return context;
}

// Export action types and constants
export { JOURNAL_ACTIONS, ENTRY_TYPES, JOURNAL_PROMPTS };