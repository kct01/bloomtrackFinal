import { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Create the context
const ThemeContext = createContext();

// Preset themes
const PRESET_THEMES = {
  softPink: {
    id: 'softPink',
    name: '🌸 Soft Pink',
    colors: {
      primary: '#F4A6CD',
      accent: '#FFB5A7',
      background: '#fef7f0',
      light: '#fdf4f4',
      dark: '#d1477a'
    }
  },
  sageGreen: {
    id: 'sageGreen',
    name: '🌿 Sage Green',
    colors: {
      primary: '#A8D8A8',
      accent: '#B5E7A0',
      background: '#f0f8f0',
      light: '#f4fbf4',
      dark: '#5a9e5a'
    }
  },
  lavenderDreams: {
    id: 'lavenderDreams',
    name: '💜 Lavender Dreams',
    colors: {
      primary: '#C8A8E9',
      accent: '#E0B3FF',
      background: '#f7f3ff',
      light: '#faf7ff',
      dark: '#8b5dbf'
    }
  },
  warmPeach: {
    id: 'warmPeach',
    name: '🍑 Warm Peach',
    colors: {
      primary: '#FFB5A7',
      accent: '#FFC4B8',
      background: '#fff7f5',
      light: '#fffcfb',
      dark: '#e6826f'
    }
  },
  oceanBlue: {
    id: 'oceanBlue',
    name: '🌊 Ocean Blue',
    colors: {
      primary: '#7DD3FC',
      accent: '#93C5FD',
      background: '#f0f9ff',
      light: '#f8fcff',
      dark: '#0284c7'
    }
  },
  sunsetOrange: {
    id: 'sunsetOrange',
    name: '🌅 Sunset Orange',
    colors: {
      primary: '#F4A261',
      accent: '#E76F51',
      background: '#fff8f3',
      light: '#fffcf9',
      dark: '#d17843'
    }
  },
  roseGold: {
    id: 'roseGold',
    name: '🌺 Rose Gold',
    colors: {
      primary: '#E8B4B8',
      accent: '#F4A6CD',
      background: '#fdf5f6',
      light: '#fefbfc',
      dark: '#c5888c'
    }
  },
  minimalistGray: {
    id: 'minimalistGray',
    name: '🤍 Minimalist Gray',
    colors: {
      primary: '#9CA3AF',
      accent: '#D1D5DB',
      background: '#f9fafb',
      light: '#ffffff',
      dark: '#4b5563'
    }
  }
};

// Initial state
const initialState = {
  currentTheme: PRESET_THEMES.softPink,
  customColors: null,
  isCustomTheme: false
};

// Action types
const THEME_ACTIONS = {
  SET_PRESET_THEME: 'SET_PRESET_THEME',
  SET_CUSTOM_THEME: 'SET_CUSTOM_THEME',
  RESET_TO_DEFAULT: 'RESET_TO_DEFAULT',
  LOAD_SAVED_THEME: 'LOAD_SAVED_THEME'
};

// Reducer function
function themeReducer(state, action) {
  switch (action.type) {
    case THEME_ACTIONS.SET_PRESET_THEME:
      return {
        ...state,
        currentTheme: action.payload,
        isCustomTheme: false,
        customColors: null
      };

    case THEME_ACTIONS.SET_CUSTOM_THEME:
      const customTheme = {
        id: 'custom',
        name: '🎨 Custom Theme',
        colors: action.payload
      };
      return {
        ...state,
        currentTheme: customTheme,
        customColors: action.payload,
        isCustomTheme: true
      };

    case THEME_ACTIONS.RESET_TO_DEFAULT:
      return {
        ...state,
        currentTheme: PRESET_THEMES.softPink,
        isCustomTheme: false,
        customColors: null
      };

    case THEME_ACTIONS.LOAD_SAVED_THEME:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Helper function to apply theme to CSS variables
function applyThemeToCSS(theme) {
  const root = document.documentElement;
  const colors = theme.colors;

  root.style.setProperty('--color-soft-pink', colors.primary);
  root.style.setProperty('--color-sage-green', colors.accent);
  root.style.setProperty('--color-cream-white', colors.background);
  root.style.setProperty('--color-warm-white', colors.light);
  root.style.setProperty('--theme-primary', colors.primary);
  root.style.setProperty('--theme-accent', colors.accent);
  root.style.setProperty('--theme-background', colors.background);
  root.style.setProperty('--theme-light', colors.light);
  root.style.setProperty('--theme-dark', colors.dark);
}

// Helper function to generate complementary colors
function generateComplementaryColors(primaryColor) {
  // This is a simplified version - in a real app you'd use a color library
  const accent = lightenColor(primaryColor, 20);
  const background = lightenColor(primaryColor, 80);
  const light = lightenColor(primaryColor, 90);
  const dark = darkenColor(primaryColor, 30);

  return {
    primary: primaryColor,
    accent,
    background,
    light,
    dark
  };
}

function lightenColor(color, percent) {
  // Simplified color lightening - you'd want a proper color manipulation library
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}

// ThemeProvider component
export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  // Apply theme to CSS whenever currentTheme changes
  useEffect(() => {
    if (state.currentTheme) {
      applyThemeToCSS(state.currentTheme);
      // Only save to storage after initialization to avoid overriding loaded data
      if (isInitialized) {
        saveThemeToStorage();
      }
    }
  }, [state.currentTheme, state.isCustomTheme, isInitialized]);

  // Local storage functions
  const saveThemeToStorage = () => {
    try {
      const themeData = {
        currentTheme: state.currentTheme,
        customColors: state.customColors,
        isCustomTheme: state.isCustomTheme
      };
      console.log('💾 Saving theme to localStorage:', themeData);
      localStorage.setItem('bloomtrack_theme', JSON.stringify(themeData));
      console.log('✅ Theme saved successfully');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const loadSavedTheme = () => {
    try {
      const saved = localStorage.getItem('bloomtrack_theme');
      if (saved) {
        const themeData = JSON.parse(saved);
        console.log('Loading saved theme:', themeData);
        dispatch({
          type: THEME_ACTIONS.LOAD_SAVED_THEME,
          payload: themeData
        });
      } else {
        console.log('No saved theme found, using default');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      // Set initialized flag after attempting to load
      setIsInitialized(true);
    }
  };

  // Action creators
  const actions = {
    setPresetTheme: (themeId) => {
      const theme = PRESET_THEMES[themeId];
      if (theme) {
        dispatch({
          type: THEME_ACTIONS.SET_PRESET_THEME,
          payload: theme
        });
      }
    },

    setCustomTheme: (primaryColor) => {
      const customColors = generateComplementaryColors(primaryColor);
      dispatch({
        type: THEME_ACTIONS.SET_CUSTOM_THEME,
        payload: customColors
      });
    },

    setFullCustomTheme: (colors) => {
      dispatch({
        type: THEME_ACTIONS.SET_CUSTOM_THEME,
        payload: colors
      });
    },

    resetToDefault: () => {
      dispatch({
        type: THEME_ACTIONS.RESET_TO_DEFAULT
      });
    }
  };

  const contextValue = {
    // State
    currentTheme: state.currentTheme,
    isCustomTheme: state.isCustomTheme,
    customColors: state.customColors,
    
    // Actions
    ...actions,
    
    // Constants
    PRESET_THEMES
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use ThemeContext
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

// Export action types and constants
export { THEME_ACTIONS, PRESET_THEMES };